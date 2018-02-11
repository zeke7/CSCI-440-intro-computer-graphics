"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

var lightPosition = vec4(-1.0, -1.0, 3.0, 0.0 );
var lightAmbient = vec4(0.9, 0.9, 0.9, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 0.0, 1.0 );

//gold
var materialAmbient = vec4( 0.24725, 0.1995, 0.0745, 1.0 );
var materialDiffuse = vec4( 0.75164, 0.60648, 0.22648, 1.0);
var materialSpecular = vec4( 0.628281, 0.555802, 0.366065, 1.0 );
var materialShininess = 10.0;

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

var torsoIdx = 11;
var headIdx  = 12;
var head1Idx = 12;
var head2Idx = 21;
var leftUpperArmIdx = 13;
var leftLowerArmIdx = 14;
var rightUpperArmIdx = 15;
var rightLowerArmIdx = 16;
var leftUpperLegIdx = 17;
var leftLowerLegIdx = 18;
var rightUpperLegIdx = 19;
var rightLowerLegIdx = 20;
var tailIdx = 22;
var tail1Idx = 22;

var leftfootId = 23;
var rightfootId = 24;
var ballId = 25

var torsoHeight = 5.0;
var torsoWidth  = 2.0;
var upperArmHeight = 2.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.7;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.7;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth  = 1.0;

var tailHeight = 1.3;
var tailWeight = 0.3;

var leftfootheight = 0.5;
var leftfootwidth = 0.8;
var rightfootheight = 0.5;
var rightfootwidth = 0.8;

var ballh = 0.6;
var ballw = 0.6;
var ballp = 1.9;
var ballm = 0;

var dogx = 4;
var dogy = -2;

var numNodes = 26;
var numAngles = 26;

var theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 300, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0, 0,0, 0];

var stack = [];
var figure = [];

var stackx = [];
var figurex = [];

var fb = true;
var Tstep1 = true;
var tailIdWag = true;
var throwball = false;
var liedown = false;

var down = false;
var shakehead = true;
var comehere = false;
var move = false;
var djump = true;
var djumpx = false;
var djumpxxx = false;



var walk = false;
var run = false;
var wave = false;
var reset = false;

var direction1 = false;
var direction2 = false;
var direction3 = true;
var direction4 = false;

var direction5 = false;
var direction6 = false;

var catchball = false;
var step1 = false;
var step2 = false;
var step3 = false;
var step4 = false;
var step5 = false;
var step6 = false;
var djumpxx = false;

var jumppp = true;

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer, nBuffer;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

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

function initNodes(Id, ballp, ballm) {

    var m = mat4();

    switch(Id) {

    case torsoId:
        m = translate(-6, -0.5, 0);
        m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
		figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:
		m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
		m = mult(m, rotate(theta[head1Id], 1, 0, 0))
		m = mult(m, rotate(theta[head2Id], 0, 1, 0));
		m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
		figure[headId] = createNode( m, head, leftUpperArmId, null);
    break;

    case leftUpperArmId:
		m = translate(-(torsoWidth/1.75), 0.95*torsoHeight, 0.0);
		m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
		figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:
		m = translate(torsoWidth/1.75, 0.95*torsoHeight, 0.0);
		m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
		figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:
		m = translate(-(torsoWidth/2.0), 0.1*upperLegHeight, 0.0);
		m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
		figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
		m = translate(torsoWidth/2.0, 0.1*upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
		figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;

    case leftLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerArmId], 0, 0, 1));
		figure[leftLowerArmId] = createNode( m, leftLowerArm, null, ballId );
    break;

    case rightLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerArmId], 0, 0, 1));
		figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
		figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, leftfootId );
    break;

    case rightLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
		figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, rightfootId );
    break;







    case leftfootId:
        m = translate(0.0, lowerLegHeight/2, -0.1);
        m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
        figure[leftfootId] = createNode( m, leftfoot, null, null );
    break;

  case rightfootId:
        m = translate(0.0, lowerLegHeight/2, -0.1);
        m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
        figure[rightfootId] = createNode( m, rightfoot, null, null );
    break;  

    case ballId:
        m = translate(0.0, ballp, ballm);
        m = mult(m, rotate(theta[ballId], 1, 0, 0));
        figure[ballId] = createNode( m, ball, null, null );
    break;


    }
}

function initNodes2(Id, dogx, dogy) {

    var m = mat4();

    switch(Id) {

    case torsoIdx:
    

    m = translate(dogx, dogy, 0);
    m = mult(m, rotate(theta[torsoIdx], 0, 1, 0 ));
    
    figure[torsoIdx] = createNode( m, torsox, null, headIdx );
    break;

    case headIdx:
    case head1Idx:


    m = mult(m, rotate(theta[head1Idx], 1, 0, 0));
    m = mult(m, translate(0.0, torsoWidth/2/1.1, -0.3));
    figure[headIdx] = createNode( m, headx, leftUpperArmIdx, null);

    break;




    case leftUpperLegIdx:

    m = translate(-torsoWidth/2+upperLegWidth/2, -upperArmHeight/2/1.5+torsoWidth/1.5, -torsoHeight/2/1.5+upperLegWidth/1.4);
    m = mult(m , rotate(theta[leftUpperLegIdx], 1, 0, 0));
    figure[leftUpperLegIdx] = createNode( m, leftUpperLegx, rightUpperLegIdx, leftLowerLegIdx );
    break;

    case rightUpperLegIdx:

    m = translate(torsoWidth/2-upperLegWidth/2, -upperArmHeight/2/1.5+torsoWidth/1.5, -torsoHeight/2/1.5+upperLegWidth/1.4);
    m = mult(m, rotate(theta[rightUpperLegIdx], 1, 0, 0));
    figure[rightUpperLegIdx] = createNode( m, rightUpperLegx, tailIdx, rightLowerLegIdx );
    break;

    case leftLowerLegIdx:

    m = translate(0.0, upperLegHeight/2+0.1, 0.0);
    m = mult(m, rotate(theta[leftLowerLegIdx], 1, 0, 0));
    figure[leftLowerLegIdx] = createNode( m, leftLowerLegx, null, null );
    break;

    case rightLowerLegIdx:

    m = translate(0.0, upperLegHeight/2+0.1, 0.0);
    m = mult(m, rotate(theta[rightLowerLegIdx], 1, 0, 0));
    figure[rightLowerLegIdx] = createNode( m, rightLowerLegx, null, null );
    break;

    case leftUpperArmIdx:

    
    m = translate(-torsoWidth/2+upperLegWidth/2, -torsoWidth/2, torsoHeight/2/1.5-upperLegWidth/1.5);
    m = mult(m, rotate(theta[leftUpperArmIdx], 1, 0, 0));
    figure[leftUpperArmIdx] = createNode( m, leftUpperArmx, rightUpperArmIdx, leftLowerArmIdx );
    break;

    case rightUpperArmIdx:

    m = translate(torsoWidth/2-upperLegWidth/2, -torsoWidth/2, torsoHeight/2/1.5-upperLegWidth/1.5);
    m = mult(m, rotate(theta[rightUpperArmIdx], 1, 0, 0));
   
    figure[rightUpperArmIdx] = createNode( m, rightUpperArmx, leftUpperLegIdx, rightLowerArmIdx );
    break;

    case leftLowerArmIdx:

    m = translate(0.0, -upperArmHeight/2-lowerArmHeight/2, 0.0);
    m = mult(m, rotate(theta[leftLowerArmIdx], 1, 0, 0));
    figure[leftLowerArmIdx] = createNode( m, leftLowerArmx, null, null );
    break;

    case rightLowerArmIdx:

    m = translate(0.0, -upperArmHeight/2-lowerArmHeight/2, 0.0);
    m = mult(m, rotate(theta[rightLowerArmIdx], 1, 0, 0));
    figure[rightLowerArmIdx] = createNode( m, rightLowerArmx, null, null );
    break;

    case tailIdx:
    case tail1Idx:
    

    
    m = mult(m, rotate(theta[tail1Idx], 0, 0, 1));
    m = mult(m, translate(0, torsoWidth/1.5, -torsoHeight/2/1.5+tailWeight/2));
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

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.4 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.1 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.4 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.1 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function leftfoot() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2 * lowerLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(leftfootwidth, leftfootheight, leftfootwidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightfoot() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2 * lowerLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(rightfootwidth, rightfootheight, rightfootwidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function ball() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2 * lowerArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(ballw, ballh, ballw) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}














function torsox() {


    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(90));
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight/1.5, torsoWidth/1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function headx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0, torsoHeight/2 ));
    
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight/1.2, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArmx() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0, 0) );
    instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight/1.5, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArmx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight/2, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArmx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight/1.5, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArmx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, rotateX(180));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight/2, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLegx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0) );
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperArmHeight/1.5, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLegx() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight/2, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLegx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperArmHeight/1.5, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLegx() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight/2, lowerLegWidth) )
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
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
	 
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[d]);
     normalsArray.push(normal);
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

	gl.enable(gl.DEPTH_TEST);
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    cube();

	nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

	document.getElementById("Button1").onclick = function() {
        liedown = false;
        comehere = false;
        catchball = false;
        theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 300, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0, 0,0, 0];
        ballp = 1.9;
        ballm = 0;
        dogx = 4;
        dogy = -2;
        Tstep1 = true;
        tailIdWag = true;
        throwball = false;
        liedown = false;
        down = false;
        shakehead = true;
        comehere = false;
        move = false;
        djump = true;
        djumpx = false;
        djumpxxx = false;
        walk = false;
        run = false;
        wave = false;
        reset = false;
        direction1 = false;
        direction2 = false;
        direction3 = true;
        direction4 = false;
        direction5 = false;
        direction6 = false;
        catchball = false;
        step1 = false;
        step2 = false;
        step3 = false;
        step4 = false;
        step5 = false;
        step6 = false;
        djumpxx = false;
        jumppp = true;
        initNodes2(torsoIdx, dogx, dogy);
        initNodes2(tailIdx, dogx, dogy);
        initNodes(ballId,ballp,ballm);
        initNodes(leftUpperArmId,ballp,ballm);
        initNodes2(leftUpperLegIdx); 
        initNodes2(rightUpperLegIdx);
        initNodes2(leftUpperArmIdx); 
        initNodes2(rightUpperArmIdx);
        initNodes(leftUpperArmId);
        initNodes(rightUpperArmId);
        initNodes(leftLowerArmId);
        initNodes(rightLowerArmId);
        initNodes2(headIdx);
        initNodes(headId);
        throwball = true;

   }
   document.getElementById("Button2").onclick = function() {
        throwball = false;
        comehere = false;
        catchball = false;
        theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 300, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0, 0,0, 0];
        ballp = 1.9;
        ballm = 0;
        dogx = 4;
        dogy = -2;
        Tstep1 = true;
        tailIdWag = true;
        throwball = false;
        liedown = false;
        down = false;
        shakehead = true;
        comehere = false;
        move = false;
        djump = true;
        djumpx = false;
        djumpxxx = false;
        walk = false;
        run = false;
        wave = false;
        reset = false;
        direction1 = false;
        direction2 = false;
        direction3 = true;
        direction4 = false;
        direction5 = false;
        direction6 = false;
        catchball = false;
        step1 = false;
        step2 = false;
        step3 = false;
        step4 = false;
        step5 = false;
        step6 = false;
        djumpxx = false;
        jumppp = true;
        initNodes2(torsoIdx, dogx, dogy);
        initNodes2(tailIdx, dogx, dogy);
        initNodes(ballId,ballp,ballm);
        initNodes(leftUpperArmId,ballp,ballm);
        initNodes2(leftUpperLegIdx); 
        initNodes2(rightUpperLegIdx);
        initNodes2(leftUpperArmIdx); 
        initNodes2(rightUpperArmIdx);
        initNodes(leftUpperArmId);
        initNodes(rightUpperArmId);
        initNodes(leftLowerArmId);
        initNodes(rightLowerArmId);
        initNodes2(headIdx);
        initNodes(headId);
        liedown = true;
   }

   document.getElementById("Button3").onclick = function() {
        throwball = false;
        liedown = false;
        catchball = false;
        theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 300, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0, 0,0, 0];
        ballp = 1.9;
        ballm = 0;
        dogx = 4;
        dogy = -2;
        Tstep1 = true;
        tailIdWag = true;
        throwball = false;
        liedown = false;
        down = false;
        shakehead = true;
        comehere = false;
        move = false;
        djump = true;
        djumpx = false;
        djumpxxx = false;
        walk = false;
        run = false;
        wave = false;
        reset = false;
        direction1 = false;
        direction2 = false;
        direction3 = true;
        direction4 = false;
        direction5 = false;
        direction6 = false;
        catchball = false;
        step1 = false;
        step2 = false;
        step3 = false;
        step4 = false;
        step5 = false;
        step6 = false;
        djumpxx = false;
        jumppp = true;
        initNodes2(torsoIdx, dogx, dogy);
        initNodes2(tailIdx, dogx, dogy);
        initNodes(ballId,ballp,ballm);
        initNodes(leftUpperArmId,ballp,ballm);
        initNodes2(leftUpperLegIdx); 
        initNodes2(rightUpperLegIdx);
        initNodes2(leftUpperArmIdx); 
        initNodes2(rightUpperArmIdx);
        initNodes(leftUpperArmId);
        initNodes(rightUpperArmId);
        initNodes(leftLowerArmId);
        initNodes(rightLowerArmId);
        initNodes2(headIdx);
        initNodes(headId);
        comehere = true;

   }

    document.getElementById("Button4").onclick = function() {
        throwball = false;
        liedown = false;
        comehere = false;

        theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 300, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0, 0,0, 0];
        ballp = 1.9;
        ballm = 0;
        dogx = 4;
        dogy = -2;
        Tstep1 = true;
        tailIdWag = true;
        throwball = false;
        liedown = false;
        down = false;
        shakehead = true;
        comehere = false;
        move = false;
        djump = true;
        djumpx = false;
        djumpxxx = false;
        walk = false;
        run = false;
        wave = false;
        reset = false;
        direction1 = false;
        direction2 = false;
        direction3 = true;
        direction4 = false;
        direction5 = false;
        direction6 = false;
        catchball = false;
        step1 = false;
        step2 = false;
        step3 = false;
        step4 = false;
        step5 = false;
        step6 = false;
        djumpxx = false;
        jumppp = true;
        initNodes2(torsoIdx, dogx, dogy);
        initNodes2(tailIdx, dogx, dogy);
        initNodes(ballId,ballp,ballm);
        initNodes(leftUpperArmId,ballp,ballm);
        initNodes2(leftUpperLegIdx); 
        initNodes2(rightUpperLegIdx);
        initNodes2(leftUpperArmIdx); 
        initNodes2(rightUpperArmIdx);
        initNodes(leftUpperArmId);
        initNodes(rightUpperArmId);
        initNodes(leftLowerArmId);
        initNodes(rightLowerArmId);
        initNodes2(headIdx);
        initNodes(headId);
        catchball = true;
        step1 = true;
    }

    document.getElementById("reset").onclick = function() {
        throwball = false;
        liedown = false;
        comehere = false;
        catchball = false;
        theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 300, -10 , 0, 0, 0, 0, 180, 0, 180, 0, 0, 0, 0,0, 0];
        ballp = 1.9;
        ballm = 0;
        dogx = 4;
        dogy = -2;
        Tstep1 = true;
        tailIdWag = true;
        throwball = false;
        liedown = false;
        down = false;
        shakehead = true;
        comehere = false;
        move = false;
        djump = true;
        djumpx = false;
        djumpxxx = false;
        walk = false;
        run = false;
        wave = false;
        reset = false;
        direction1 = false;
        direction2 = false;
        direction3 = true;
        direction4 = false;
        direction5 = false;
        direction6 = false;
        catchball = false;
        step1 = false;
        step2 = false;
        step3 = false;
        step4 = false;
        step5 = false;
        step6 = false;
        djumpxx = false;
        jumppp = true;
        initNodes2(torsoIdx, dogx, dogy);
        initNodes2(tailIdx, dogx, dogy);
        initNodes(ballId,ballp,ballm);
        initNodes(leftUpperArmId,ballp,ballm);
        initNodes2(leftUpperLegIdx); 
        initNodes2(rightUpperLegIdx);
        initNodes2(leftUpperArmIdx); 
        initNodes2(rightUpperArmIdx);
        initNodes(leftUpperArmId);
        initNodes(rightUpperArmId);
        initNodes(leftLowerArmId);
        initNodes(rightLowerArmId);
        initNodes2(headIdx);
        initNodes(headId);
    }
	
	// Buttons here
	
	
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);	
	
    for(i=0; i<numNodes; i++) initNodes(i,ballp, ballm);
    for(i=0; i<numNodes; i++) initNodes2(i, dogx, dogy);

	render();
}

var render = function() {


    // Throw ball and catch
    if(throwball){

        if(direction3){
            theta[leftUpperLegIdx] -=2 ;
            theta[rightUpperLegIdx] +=2 ;
            theta[leftUpperArmIdx] -=2 ;
            theta[rightUpperArmIdx] +=2 ;
             
            
            initNodes2(leftUpperLegIdx); 
            initNodes2(rightUpperLegIdx);

            initNodes2(leftUpperArmIdx); 
            initNodes2(rightUpperArmIdx);

            
       }else{
            theta[rightUpperLegIdx] -=2 ;
            theta[leftUpperLegIdx] +=2 ;
            theta[leftUpperArmIdx] +=2 ;
            theta[rightUpperArmIdx] -=2 ;
            
            
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
    if (Tstep1) {
        if (theta[leftUpperArmId] >= -560){
            theta[leftUpperArmId]-=6;
            initNodes(leftUpperArmId,ballp,ballm);
        }else{
            if (ballm >= -4) {
                ballm -= 0.15;
                initNodes(ballId,ballp,ballm);
            }
            if (dogy <= 0 && dogx >= -2) {
                dogy += 0.1;
                dogx -= 0.3;
                initNodes2(torsoIdx, dogx, dogy);
            }
            if (dogy >= 0) {
                Tstep1 = false;
            }
        }
    }else{


            if (dogy >= -2){ 
                dogy -= 0.1;
                ballp += 0.11;
                initNodes(ballId,ballp,ballm);
                initNodes2(torsoIdx, dogx, dogy);
            }

            if (tailIdWag) {
                theta[tailIdx]+=3;
                initNodes2(tailIdx, dogx, dogy);
            }else{
                theta[tailIdx]-=3;
                initNodes2(tailIdx, dogx, dogy);
            }
            if (theta[tailIdx] >20) {
                tailIdWag = !tailIdWag
            }if (theta[tailIdx] < -20) {
                tailIdWag = !tailIdWag
            }
        }
    }
    


    if (liedown) {
      
           if(theta[leftUpperArmId] >= 0){
                theta[leftUpperArmId] -=3;
                theta[rightUpperArmId] -=3;
                initNodes(leftUpperArmId);
                initNodes(rightUpperArmId);

           }else{
                direction2 = true;
                direction4 = true;
                if (dogx <= 1){
                    direction4 = false;
                    down = true;
                } 
           }

           if (direction2) {

               if (direction1) {
                    theta[leftLowerArmId] +=2;
                    theta[rightLowerArmId] -=2;
                    initNodes(leftLowerArmId);
                    initNodes(rightLowerArmId);
               }else{
                    theta[leftLowerArmId] -=2;
                    theta[rightLowerArmId] +=2;
                    initNodes(leftLowerArmId);
                    initNodes(rightLowerArmId);
               }

               if (theta[leftLowerArmId] >=30) {
                    direction1 = !direction1;
               }

               if (theta[leftLowerArmId] <=-30) {
                    direction1 = !direction1;
               }

           }

           if (direction4) {
                if (dogx >= 1){ 
                    dogx -= 0.1;
                    initNodes2(torsoIdx, dogx, dogy);
                }
                
                if(direction3){
                    theta[leftUpperLegIdx] -=2 ;
                    theta[rightUpperLegIdx] +=2 ;
                    theta[leftUpperArmIdx] -=2 ;
                    theta[rightUpperArmIdx] +=2 ;
                     
                    
                    initNodes2(leftUpperLegIdx); 
                    initNodes2(rightUpperLegIdx);

                    initNodes2(leftUpperArmIdx); 
                    initNodes2(rightUpperArmIdx);

                    
                }else{
                        theta[rightUpperLegIdx] -=2 ;
                        theta[leftUpperLegIdx] +=2 ;
                        theta[leftUpperArmIdx] +=2 ;
                        theta[rightUpperArmIdx] -=2 ;
                        
                        
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

           if (down) {
                if ( theta[leftUpperLegIdx] <= 240) {
                theta[leftUpperLegIdx] +=2 ;
                theta[rightUpperLegIdx] +=2 ;
                theta[leftUpperArmIdx] -=2 ;
                theta[rightUpperArmIdx] -=2 ;
                dogy-=0.03;
                initNodes2(torsoIdx, dogx, dogy);
                initNodes2(rightUpperLegIdx);
                initNodes2(leftUpperLegIdx); 
                initNodes2(leftUpperArmIdx); 
                initNodes2(rightUpperArmIdx);
              }

              if (shakehead) {
                    theta[headIdx] += 0.3;
                    initNodes2(headIdx);
                }else{
                    theta[headIdx] -= 0.3;
                    initNodes2(headIdx);
                }
                if (theta[headIdx] >-6) {
                    shakehead = !shakehead;
                }if (theta[tailIdx] < -14) {
                    shakehead = !shakehead;
            }



           }

            if (tailIdWag) {
                theta[tailIdx]+=3;
                initNodes2(tailIdx, dogx, dogy);
            }else{
                theta[tailIdx]-=3;
                initNodes2(tailIdx, dogx, dogy);
            }
            if (theta[tailIdx] >20) {
                tailIdWag = !tailIdWag
            }if (theta[tailIdx] < -20) {
                tailIdWag = !tailIdWag
            }
          
    }

    if (comehere) {

         if(theta[rightUpperArmId] >= 60){
                theta[leftUpperArmId] -=2;
                theta[rightUpperArmId] -=3;
                initNodes(leftUpperArmId);
                initNodes(rightUpperArmId);
           }else{
                move = true;
           }
           if (direction5) {

                    theta[leftLowerArmId] -=2;
                    initNodes(leftLowerArmId);
               }else{

                    theta[leftLowerArmId] +=2;
                    initNodes(leftLowerArmId);
               }

               if (theta[leftLowerArmId] >=20) {
                    direction5 = !direction5;
               }

               if (theta[leftLowerArmId] <=-20) {
                    direction5 = !direction5;
            }
            if (move) {

                if(direction3){
                    theta[leftUpperLegIdx] -=2 ;
                    theta[rightUpperLegIdx] +=2 ;
                    theta[leftUpperArmIdx] -=2 ;
                    theta[rightUpperArmIdx] +=2 ;
                     
                    
                    initNodes2(leftUpperLegIdx); 
                    initNodes2(rightUpperLegIdx);

                    initNodes2(leftUpperArmIdx); 
                    initNodes2(rightUpperArmIdx);

                    
                }else{
                        theta[rightUpperLegIdx] -=2 ;
                        theta[leftUpperLegIdx] +=2 ;
                        theta[leftUpperArmIdx] +=2 ;
                        theta[rightUpperArmIdx] -=2 ;
                        
                        
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
                if (dogx >= -1){ 
                    dogx -= 0.1;
                    initNodes2(torsoIdx, dogx, dogy);
                }

                if (dogx <= -1) {
                    djumpx = true;
                }

               if (djumpx) {

                    if (djump) {
                         dogy += 0.2;
                        initNodes2(torsoIdx, dogx, dogy);

                    }else{
                        dogy -= 0.2;
                        initNodes2(torsoIdx, dogx, dogy);
                    }

                    if (dogy <= 2){ 
                       djump = !djump;
                    }
                    if (dogy >= -2){ 
                        
                       djump = !djump;   
                    }




               }

               if (shakehead) {
                    theta[headIdx] += 0.5;
                    initNodes2(headIdx);
                }else{
                    theta[headIdx] -= 0.5;
                    initNodes2(headIdx);
                }
                if (theta[headIdx] >-5) {
                    shakehead = !shakehead;
                }if (theta[tailIdx] < -14) {
                    shakehead = !shakehead;
            }

                if (tailIdWag) {
                    theta[tailIdx]+=3;
                    initNodes2(tailIdx, dogx, dogy);
                }else{
                    theta[tailIdx]-=3;
                    initNodes2(tailIdx, dogx, dogy);
                }
                if (theta[tailIdx] >20) {
                    tailIdWag = !tailIdWag
                }if (theta[tailIdx] < -20) {
                    tailIdWag = !tailIdWag
                }
            }

        }

        if (catchball) {

            if (step1) {
                if (theta[leftUpperArmId] >= 90) {
                    theta[leftUpperArmId]--;
                    initNodes(leftUpperArmId);
                }else{
                    step2 = true;
                    step1 = false;
                }
            }
            
            if (step2) {
                if (dogx >= -1){ 
                    dogx -= 0.1;
                    initNodes2(torsoIdx, dogx, dogy);
                }

                if (dogx <= -1) {
                    step3 = true;
                }
            }

             if (theta[leftUpperArmId] < 60) {
                    step4 = true;
                    step3 = false;
                }

            if (step3) {
                    if (djump) {
                         dogy += 0.2;
                        initNodes2(torsoIdx, dogx, dogy);

                    }else{
                        dogy -= 0.2;
                        initNodes2(torsoIdx, dogx, dogy);
                    }

                    if (dogy <= 2){ 
                       djump = !djump;
                    }
                    if (dogy >= -2){ 
                        
                       djump = !djump;   
                    }

                if (theta[leftUpperArmId] >= 60) {
                    theta[leftUpperArmId]--;
                    initNodes(leftUpperArmId);
                }
               
            }

            if (step4) {

                if (theta[leftUpperArmId] >= 30) {
                    theta[leftUpperArmId]--;
                    initNodes(leftUpperArmId);
                }

                if (jumppp ) {

                if (djumpxxx ) {
                        dogy += 0.2;
                        initNodes2(torsoIdx, dogx, dogy);
                        
                    }else{
                        dogy -= 0.2;
                        initNodes2(torsoIdx, dogx, dogy);
                    }

                    if (dogy <= 4){ 
                       djumpxxx = !djumpxxx;
                    }
                    if (dogy >= -2){ 
                        
                       djumpxxx = !djumpxxx;   
                    }
                }

            }

            if (theta[leftUpperArmId] < 30) {
                    step5 = true;
                    step4 = false;
            }

            
            if (theta[leftUpperArmId] >= 0) {
                    theta[leftUpperArmId]-= 0.2;
                    initNodes(leftUpperArmId);
            }



            if (step5) {
                if ( theta[torsoIdx] <= 430) {
                    theta[torsoIdx] += 0.5; 
                    initNodes2(torsoIdx, dogx, dogy);
                }else{
                    jumppp = false;
                    step3 = false;
                    
                    if (dogy > -2) {
                        dogy -= 0.1;
                        initNodes2(torsoIdx, dogx, dogy);
                    }else{
                        dogx += 0.2;
                        initNodes2(torsoIdx, dogx, dogy);
                        if (!step6) {
                            theta[leftLowerArmId] -= 2;
                            initNodes(leftLowerArmId);
                        }else{
                            theta[leftLowerArmId] += 2;
                            initNodes(leftLowerArmId);
                        }

                         if (theta[leftLowerArmId] >=30) {
                            step6 = !step6;
                           }

                           if (theta[leftLowerArmId] <=-30) {
                                step6 = !step6;
                           }

                           if (theta[headId] <= 200) {
                                theta[headId]+= 0.5;
                                initNodes(headId);
                           }
                    }
                }
               
            }
            












            if(direction6){
                    theta[leftUpperLegIdx] -=2 ;
                    theta[rightUpperLegIdx] +=2 ;
                    theta[leftUpperArmIdx] -=2 ;
                    theta[rightUpperArmIdx] +=2 ;
                     
                    
                    initNodes2(leftUpperLegIdx); 
                    initNodes2(rightUpperLegIdx);

                    initNodes2(leftUpperArmIdx); 
                    initNodes2(rightUpperArmIdx);

                    
                }else{
                        theta[rightUpperLegIdx] -=2 ;
                        theta[leftUpperLegIdx] +=2 ;
                        theta[leftUpperArmIdx] +=2 ;
                        theta[rightUpperArmIdx] -=2 ;
                        
                        
                        initNodes2(leftUpperLegIdx);
                        initNodes2(rightUpperLegIdx);
                        initNodes2(leftUpperArmIdx); 
                        initNodes2(rightUpperArmIdx);
                        
                }
      
               if(theta[leftUpperLegIdx] == 150){
                    direction6 = !direction6;
               }

               if (theta[leftUpperLegIdx] >= 200) {
                     direction6 = !direction6;
               }    

                if (tailIdWag) {
                    theta[tailIdx]+=3;
                    initNodes2(tailIdx, dogx, dogy);
                }else{
                    theta[tailIdx]-=3;
                    initNodes2(tailIdx, dogx, dogy);
                }
                if (theta[tailIdx] >20) {
                    tailIdWag = !tailIdWag
                }if (theta[tailIdx] < -20) {
                    tailIdWag = !tailIdWag
                }













        }
        


       

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		traverse(torsoId);
        traverse(torsoIdx);
        requestAnimFrame(render);
}
