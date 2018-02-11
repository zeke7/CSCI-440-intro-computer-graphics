"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var lightModelViewMatrix;
var lightModelViewMatrixLoc;
var eye = vec3(0.0, 0.0, 0.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var normalMatrix, normalMatrixLoc;

var instanceMatrix;
var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];


var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 11;
var tail1Id = 11;

var torsoIdx = 12;
var headIdx  = 13;
var head1Idx = 13;
var head2Idx = 22;
var leftUpperArmIdx = 14;
var leftLowerArmIdx = 15;
var rightUpperArmIdx = 16;
var rightLowerArmIdx = 17;
var leftUpperLegIdx = 18;
var leftLowerLegIdx = 19;

var rightUpperLegIdx = 20;

var rightLowerLegIdx = 21;
var tailIdx = 23;
var tail1Idx = 23;





var torsoHeight = 3;
var torsoWidth = 2;

var upperArmHeight = 1.2;
var lowerArmHeight = 0.8;

var upperArmWidth  = 0.6;
var lowerArmWidth  = 0.5;

var upperLegWidth  = 0.6;
var lowerLegWidth  = 0.5;

var lowerLegHeight = 0.8;
var upperLegHeight = 1.2;

var headHeight = 1.1;
var headWidth = 0.9;

var tailHeight = 1.3;
var tailWeight = 0.3;




var numNodes =24;
var numAngles = 24;
var angle = 0;


var direction1 = true;
var direction2 = true;

var direction3 = true;
var direction4 = true;



var lightPosition = vec4(0.0, 0.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

var theta = [20, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0,   -20, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0];

var walk = -4;
var updown = 0;
var reset = false;

var walkx = 4;
var updownx = 0;

var wf1 = false;
var wb1 = false;
var wag1 = false;
var wag1f = true;
var jump1 = false;
var jump1f = true;

var wf1x = false;
var wb1x = false;
var wag1x = false;
var wag1fx = true;
var jump1x = false;
var jump1fx = true;



var numVertices = 24;

var stack = [];

var figure = [];

var stackx = [];

var figurex = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);


var vBuffer;
var modelViewLoc;

var pointsArray = [];
var lr = 0;
var ud = 0;
var fb = 0;
//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id, walk, updown) {

    var m = mat4();

    switch(Id) {

    case torsoId:
	

	m = translate(walk, updown, 0.0);
    m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:


	m = mult(m, rotate(theta[head1Id], 1, 0, 0))
	//m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, translate(0.0, torsoWidth/2/1.5+headHeight/2-0.25, 0.3));
    figure[headId] = createNode( m, head, leftUpperArmId, null);

    break;


    

    case leftUpperLegId:

    m = translate(-torsoWidth/2+upperLegWidth/2, -upperLegHeight+torsoWidth/3.5, -torsoHeight/2+upperLegWidth/2);
	m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m = translate(torsoWidth/2-upperLegWidth/2, -upperLegHeight+torsoWidth/3.5, -torsoHeight/2+upperLegWidth/2);
	m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, tailId, rightLowerLegId );
    break;

    case leftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    case leftUpperArmId:

    
    m = translate(-torsoWidth/2+upperLegWidth/2, -torsoWidth/1.6, torsoHeight/2-upperLegWidth/2-0.1);
    m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m = translate(torsoWidth/2-upperLegWidth/2, -torsoWidth/1.6, torsoHeight/2-upperLegWidth/2-0.1);
    m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
   
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftLowerArmId:

    m = translate(0.0, -upperArmHeight/2-lowerArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:

    m = translate(0.0, -upperArmHeight/2-lowerArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case tailId:
    case tail1Id:
    

    
    m = mult(m, rotate(theta[tail1Id], 0, 0, 1));
    m = mult(m, translate(0, torsoWidth/1.5, -torsoHeight/2));
    figure[tailId] = createNode( m, tail, null, null);

    break;



    }

}

function initNodes2(Id, walkx, updownx) {

    var m = mat4();

    switch(Id) {

    case torsoIdx:
    

    m = translate(walkx, updownx, 0.0);
    m = mult(m, rotate(theta[torsoIdx], 0, 1, 0 ));
    
    figure[torsoIdx] = createNode( m, torsox, null, headIdx );
    break;

    case headIdx:
    case head1Idx:


    m = mult(m, rotate(theta[head1Idx], 1, 0, 0));
    m = mult(m, translate(0.0, torsoWidth/2/1.5+headHeight/2-0.25, 0.3));
    figure[headIdx] = createNode( m, headx, leftUpperArmIdx, null);

    break;




    case leftUpperLegIdx:

    m = translate(-torsoWidth/2+upperLegWidth/2, -upperLegHeight+torsoWidth/3.5, -torsoHeight/2+upperLegWidth/2);
    m = mult(m , rotate(theta[leftUpperLegIdx], 1, 0, 0));
    figure[leftUpperLegIdx] = createNode( m, leftUpperLegx, rightUpperLegIdx, leftLowerLegIdx );
    break;

    case rightUpperLegIdx:

    m = translate(torsoWidth/2-upperLegWidth/2, -upperLegHeight+torsoWidth/3.5, -torsoHeight/2+upperLegWidth/2);
    m = mult(m, rotate(theta[rightUpperLegIdx], 1, 0, 0));
    figure[rightUpperLegIdx] = createNode( m, rightUpperLegx, tailIdx, rightLowerLegIdx );
    break;

    case leftLowerLegIdx:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegIdx], 1, 0, 0));
    figure[leftLowerLegIdx] = createNode( m, leftLowerLegx, null, null );
    break;

    case rightLowerLegIdx:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegIdx], 1, 0, 0));
    figure[rightLowerLegIdx] = createNode( m, rightLowerLegx, null, null );
    break;

    case leftUpperArmIdx:

    
    m = translate(-torsoWidth/2+upperLegWidth/2, -torsoWidth/1.6, torsoHeight/2-upperLegWidth/2-0.1);
    m = mult(m, rotate(theta[leftUpperArmIdx], 1, 0, 0));
    figure[leftUpperArmIdx] = createNode( m, leftUpperArmx, rightUpperArmIdx, leftLowerArmIdx );
    break;

    case rightUpperArmIdx:

    m = translate(torsoWidth/2-upperLegWidth/2, -torsoWidth/1.6, torsoHeight/2-upperLegWidth/2-0.1);
    m = mult(m, rotate(theta[rightUpperArmIdx], 1, 0, 0));
   
    figure[rightUpperArmIdx] = createNode( m, rightUpperArmx, leftUpperLegIdx, rightLowerArmIdx );
    break;

    case leftLowerArmIdx:

    m = translate(0.0, -upperArmHeight/2-lowerArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmIdx], 1, 0, 0));
    figure[leftLowerArmIdx] = createNode( m, leftLowerArmx, null, null );
    break;

    case rightLowerArmIdx:

    m = translate(0.0, -upperArmHeight/2-lowerArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmIdx], 1, 0, 0));
    figure[rightLowerArmIdx] = createNode( m, rightLowerArmx, null, null );
    break;

    case tailIdx:
    case tail1Idx:
    

    
    m = mult(m, rotate(theta[tail1Idx], 0, 0, 1));
    m = mult(m, translate(0, torsoWidth/1.5, -torsoHeight/2));
    figure[tailIdx] = createNode( m, tailx, null, null);

    break;
    }

}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function traverse2(Id) {

   if(Id == null) return;
   stackx.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figurex[Id].transform);
   figurex[Id].render();
   if(figurex[Id].child != null) traverse(figurex[Id].child);
    modelViewMatrix = stackx.pop();
   if(figurex[Id].sibling != null) traverse(figurex[Id].sibling);
}

function torso() {


    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(90));
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth/1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function torsox() {


    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(90));
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth/1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0, torsoHeight/2 ));
	
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function headx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0, torsoHeight/2 ));
    
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0, 0) );
	instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0, 0 ));
    instanceMatrix = mult(instanceMatrix, scale4(tailWeight, tailHeight, tailWeight) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    
}



function leftUpperArmx() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0, 0) );
    instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArmx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArmx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArmx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLegx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0) );
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLegx() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLegx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLegx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tailx() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0, 0 ));
    instanceMatrix = mult(instanceMatrix, scale4(tailWeight, tailHeight, tailWeight) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);
	
	var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    instanceMatrix = mat4();
    // instanceMatrix2 = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();
    //    modelViewMatrix2 = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
	
	var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    for(i=0; i<numNodes; i++) initNodes(i,walk,updown);
    for(i=0; i<numNodes; i++) initNodes2(i,walkx,updownx);

    document.getElementById("wf1").onclick = function() {
              wf1 = !wf1;
              wb1 = false;
    };

    document.getElementById("wb1").onclick = function() {
               wf1 = false;
              wb1 = !wb1;
    };

    document.getElementById("wag1").onclick = function() {
                wag1 = !wag1;
    }

    document.getElementById("jump1").onclick = function() {
                jump1 = !jump1;
    }




    document.getElementById("wf2").onclick = function() {
              wf1x = !wf1x;
              wb1x = false;
    };

    document.getElementById("wb2").onclick = function() {
               wf1x = false;
              wb1x = !wb1x;
    };

    document.getElementById("wag2").onclick = function() {
                wag1x = !wag1x;
    }

    document.getElementById("jump2").onclick = function() {
                jump1x = !jump1x;
    }

    document.getElementById("reset").onclick = function() {
        wb1 = false;
        wf1 = false;
        wag1 = false;
        jump1 = false;
        theta = [20, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0,   -20, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0];
        walk = -4;
        updown = 0;
        initNodes(torsoId,walk,updown);
        initNodes(leftUpperLegId);
        initNodes(rightUpperLegId);
        initNodes(leftUpperArmId); 
        initNodes(rightUpperArmId);
        initNodes(tailId);

        wb1x = false;
        wf1x = false;
        wag1x = false;
        jump1x = false;
        walkx = 4;
        updownx = 0;
        initNodes2(torsoIdx,walkx,updownx);
        initNodes2(leftUpperLegIdx);
        initNodes2(rightUpperLegIdx);
        initNodes2(leftUpperArmIdx); 
        initNodes2(rightUpperArmIdx);
        initNodes2(tailIdx);


    }
        
    document.getElementById("slider1").onchange = function(event) {
        theta[torsoId] = event.target.value;
        initNodes(torsoId,walk,updown);
    };
    document.getElementById("slider2").onchange = function(event) {
         theta[torsoIdx] = event.target.value;
          initNodes2(torsoIdx,walkx,updownx);
    };


	gl.enable(gl.DEPTH_TEST);
	
	 gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );
	lightModelViewMatrixLoc = gl.getUniformLocation( program, "lightModelViewMatrix" );
	normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );



    render();
}


var render = function() {   
		
		
       
	

       if (wf1) {
        
        walk+=0.02;
        initNodes(torsoId,walk,updown);

       if(direction1){
            theta[leftUpperLegId] -- ;
			theta[rightUpperLegId] ++ ;
            theta[leftUpperArmId] -- ;
            theta[rightUpperArmId] ++ ;
             
            
            initNodes(leftUpperLegId); 
			initNodes(rightUpperLegId);

            initNodes(leftUpperArmId); 
            initNodes(rightUpperArmId);

            
       }else{
		    theta[rightUpperLegId] -- ;
            theta[leftUpperLegId] ++ ;
            theta[leftUpperArmId] ++ ;
            theta[rightUpperArmId] -- ;
            
            
            initNodes(leftUpperLegId);
			initNodes(rightUpperLegId);
            initNodes(leftUpperArmId); 
            initNodes(rightUpperArmId);
            
       }
      
           if(theta[leftUpperLegId] == 150){
                direction1 = !direction1;
           }

           if (theta[leftUpperLegId] >= 200) {
                 direction1 = !direction1;
           }
	   
	   }


       if (wb1) {

        walk -= 0.02;
        initNodes(torsoId,walk,updown);
        
       if(direction1){
            theta[leftUpperLegId] -- ;
            theta[rightUpperLegId] ++ ;
            theta[leftUpperArmId] -- ;
            theta[rightUpperArmId] ++ ;
             
            
            initNodes(leftUpperLegId); 
            initNodes(rightUpperLegId);

            initNodes(leftUpperArmId); 
            initNodes(rightUpperArmId);

            
       }else{
            theta[rightUpperLegId] -- ;
            theta[leftUpperLegId] ++ ;
            theta[leftUpperArmId] ++ ;
            theta[rightUpperArmId] -- ;
            
            
            initNodes(leftUpperLegId);
            initNodes(rightUpperLegId);
            initNodes(leftUpperArmId); 
            initNodes(rightUpperArmId);
            
       }
      
       if(theta[leftUpperLegId] == 150){
            direction1 = !direction1;
       }

       if (theta[leftUpperLegId] >= 200) {
             direction1 = !direction1;
       }
       
       }

    if (wag1) {

       if (wag1f) {
            theta[tailId]++;
            initNodes(tailId); 
       }else{
            theta[tailId]--;
            initNodes(tailId); 
       }

       if (theta[tailId] >=20) {
            wag1f = !wag1f;
       }if (theta[tailId] <= -20){
            wag1f = !wag1f;
       }

       
   }

   if (jump1) {
        if (jump1f) {
            updown += 0.2;
             initNodes(torsoId,walk,updown);
        }else{
            updown -= 0.2;
             initNodes(torsoId,walk,updown);
        }

        if (updown >=2) {
            jump1f = !jump1f;
        }

        if (updown <=0) {
            jump1f = !jump1f;
        }
   }








// theta = [20, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0,   20, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0];
   
   if (wf1x) {
        
        walkx-=0.02;
        initNodes2(torsoIdx,walkx,updownx);

       if(direction3){
            theta[leftUpperLegIdx] -- ;
            theta[rightUpperLegIdx] ++ ;
            theta[leftUpperArmIdx] -- ;
            theta[rightUpperArmIdx] ++ ;
             
            
            initNodes2(leftUpperLegIdx); 
            initNodes2(rightUpperLegIdx);

            initNodes2(leftUpperArmIdx); 
            initNodes2(rightUpperArmIdx);

            
       }else{
            theta[rightUpperLegIdx] -- ;
            theta[leftUpperLegIdx] ++ ;
            theta[leftUpperArmIdx] ++ ;
            theta[rightUpperArmIdx] -- ;
            
            
            initNodes2(leftUpperLegIdx);
            initNodes2(rightUpperLegIdx);
            initNodes2(leftUpperArmIdx); 
            initNodes2(rightUpperArmIdx);
            
       }
      
           if(theta[leftUpperLegIdx] == 150){
                direction3 = !direction3;
           }

           if (theta[leftUpperLegIdx] >= 200) {
                 direction3 = !direction3;
           }
       
       }


       if (wb1x) {

        walkx += 0.02;
        initNodes2(torsoIdx,walkx,updownx);
        
       if(direction3){
            theta[leftUpperLegIdx] -- ;
            theta[rightUpperLegIdx] ++ ;
            theta[leftUpperArmIdx] -- ;
            theta[rightUpperArmIdx] ++ ;
             
            
            initNodes2(leftUpperLegIdx); 
            initNodes2(rightUpperLegIdx);

            initNodes2(leftUpperArmIdx); 
            initNodes2(rightUpperArmIdx);

            
       }else{
            theta[rightUpperLegIdx] -- ;
            theta[leftUpperLegIdx] ++ ;
            theta[leftUpperArmIdx] ++ ;
            theta[rightUpperArmIdx] -- ;
            
            
            initNodes2(leftUpperLegIdx);
            initNodes2(rightUpperLegIdx);
            initNodes2(leftUpperArmIdx); 
            initNodes2(rightUpperArmIdx);
            
       }
      
       if(theta[leftUpperLegIdx] == 150){
            direction3 = !direction3;
       }

       if (theta[leftUpperLegIdx] >= 200) {
             direction3 = !direction3;
       }
       
       }








    if (wag1x) {

       if (wag1fx) {
            theta[tailIdx]++;
            initNodes2(tailIdx); 
       }else{
            theta[tailIdx]--;
            initNodes2(tailIdx); 
       }

       if (theta[tailIdx] >=20) {
            wag1fx = !wag1fx;
       }if (theta[tailIdx] <= -20){
            wag1fx = !wag1fx;
       }

       
   }

   if (jump1x) {
        if (jump1fx) {
            updownx += 0.2;
             initNodes2(torsoIdx,walkx,updownx);
        }else{
            updownx -= 0.2;
             initNodes2(torsoIdx,walkx,updownx);
        }

        if (updownx >=2) {
            jump1fx = !jump1fx;
        }

        if (updownx <=0) {
            jump1fx = !jump1fx;
        }
   }

    
   

   



	  lightModelViewMatrix = lookAt(eye, at , up);
	  gl.uniformMatrix4fv(lightModelViewMatrixLoc, false, flatten(lightModelViewMatrix) );
	  
	  normalMatrix = [
        vec3(lightModelViewMatrix[0][0], lightModelViewMatrix[0][1], lightModelViewMatrix[0][2]),
        vec3(lightModelViewMatrix[1][0], lightModelViewMatrix[1][1], lightModelViewMatrix[1][2]),
        vec3(lightModelViewMatrix[2][0], lightModelViewMatrix[2][1], lightModelViewMatrix[2][2])
    ];
		 gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	
        gl.clear( gl.COLOR_BUFFER_BIT );
        
        traverse(torsoId);
        traverse(torsoIdx);
        
        requestAnimFrame(render);
}
