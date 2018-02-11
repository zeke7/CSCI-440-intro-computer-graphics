"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 5;

var index = 0;

var pointsArray = [];
var normalsArray = [];

var near = -10;
var far = 10;
var radius = 2.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var leftright = 1;
var fb = 1;
var updown =1;

var mA = [0.5,0.5,0.5];
var mD = [0.5,0.5,0.5];
var mS = [0.5,0.5,0.5];
var LA = [0.5,0.5,0.5];
var LD = [0.5,0.5,0.5];
var LS = [0.5,0.5,0.5];


var left   = -1.25;
var right  =  1.25;
var ytop   =  1.25;
var bottom = -1.25;

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);

var lightPosition = vec4( 1.0, 1.0, 1.0, 0.0 );
var lightAmbient  = vec4( 0.5, 0.5, 0.5, 1.0 );
var lightDiffuse  = vec4( 0.5, 0.5, 0.5, 1.0 );
var lightSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );

var materialAmbient  = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialDiffuse  = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialShininess = 20.0;

var modelViewMatrix, modelViewMatrixLoc;
var projectionMatrix, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;

var materialAmbientLoc;
var materialDiffuseLoc;
var materialSpecularLoc;

var lightAmbientLoc;
var lightDiffuseLoc;
var lightSpecularLoc;


var ambientProduct, ambientProductLoc;
var diffuseProduct, diffuseProductLoc;
var specularProduct, specularProductLoc;
var lightPositionLoc;

var shininessLoc;


var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

function triangle(a, b, c) {

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     // normals are vectors

     normalsArray.push(a[0], a[1], a[2], 0.0);
     normalsArray.push(b[0], b[1], b[2], 0.0);
     normalsArray.push(c[0], c[1], c[2], 0.0);

     index += 3;
}

function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
	
    materialAmbientLoc = gl.getUniformLocation( program, "materialAmbient" );
    materialDiffuseLoc  = gl.getUniformLocation( program, "materialDiffuse" );
    materialSpecularLoc = gl.getUniformLocation( program, "materialSpecular" );

    lightAmbientLoc = gl.getUniformLocation( program, "lightAmbient" );
    lightDiffuseLoc = gl.getUniformLocation( program, "lightDiffuse" );
    lightSpecularLoc = gl.getUniformLocation( program, "lightSpecular" );
	
    ambientProductLoc = gl.getUniformLocation(program,"ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program,"diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program,"specularProduct");
	lightPositionLoc = gl.getUniformLocation(program,"lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");
	

    document.getElementById("Button1").onclick = function(){radius *= 2.0;};
    document.getElementById("Button2").onclick = function(){radius *= 0.5;};
    document.getElementById("Button3").onclick = function(){theta += dr;};
    document.getElementById("Button4").onclick = function(){theta -= dr;};
    document.getElementById("Button5").onclick = function(){phi += dr;};
    document.getElementById("Button6").onclick = function(){phi -= dr;};

    

    document.getElementById("Button7").onclick = function(){
        numTimesToSubdivide++;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
    document.getElementById("Button8").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };

	
	// Code for buttons goes here

	document.getElementById("Button9").onclick = function(){updown += 0.1;};
    document.getElementById("Button10").onclick = function(){updown -= 0.1;};
    document.getElementById("Button11").onclick = function(){leftright += 0.1;};
    document.getElementById("Button12").onclick = function(){leftright -= 0.1;};
    document.getElementById("Button13").onclick = function(){fb += 0.1;};
    document.getElementById("Button14").onclick = function(){fb -= 0.1;};
	

	
	
	// Code for sliders goes here

   document.getElementById("Slider1").onchange = function(event) {
         mA[0] = event.target.value;
    };
    document.getElementById("Slider2").onchange = function(event) {
         mA[1] = event.target.value;
    };
    document.getElementById("Slider3").onchange = function(event) {
         mA[2] = event.target.value;
    };

    document.getElementById("Slider4").onchange = function(event) {
         mD[0] = event.target.value;
    };
    document.getElementById("Slider5").onchange = function(event) {
         mD[1] = event.target.value;
    };
    document.getElementById("Slider6").onchange = function(event) {
         mD[2] = event.target.value;
    };
    

    document.getElementById("Slider7").onchange = function(event) {
         mS[0] = event.target.value;
    };
    document.getElementById("Slider8").onchange = function(event) {
         mS[1] = event.target.value;
    };
    document.getElementById("Slider9").onchange = function(event) {
         mS[2] = event.target.value;
    };
    

    document.getElementById("Slider10").onchange = function(event) {
         LA[0] = event.target.value;
    };
    document.getElementById("Slider11").onchange = function(event) {
         LA[1] = event.target.value;
    };
    document.getElementById("Slider12").onchange = function(event) {
         LA[2] = event.target.value;
    };
    

    document.getElementById("Slider13").onchange = function(event) {
         LD[0] = event.target.value;
    };
    document.getElementById("Slider14").onchange = function(event) {
         LD[1] = event.target.value;
    };
    document.getElementById("Slider15").onchange = function(event) {
         LD[2] = event.target.value;
    };
    

    document.getElementById("Slider16").onchange = function(event) {
         LS[0] = event.target.value;
    };
    document.getElementById("Slider17").onchange = function(event) {
         LS[1] = event.target.value;
    };
    document.getElementById("Slider18").onchange = function(event) {
         LS[2] = event.target.value;
    };
    
    document.getElementById("Slider19").onchange = function(event) {
         materialShininess = event.target.value;
    };
	
	
	
	
    render();
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    lightPosition = vec4(leftright, updown, fb, 0.0 );

    materialAmbient  = vec4( mA[0], mA[1], mA[2], 1.0 );
    materialDiffuse = vec4( mD[0], mD[1], mD[2], 1.0 );
    materialSpecular = vec4( mS[0], mS[1], mS[2], 1.0 );
    
    lightAmbient = vec4( LA[0], LA[1], LA[2], 1.0 );
    lightDiffuse = vec4( LD[0], LD[1], LD[2], 1.0 );
    lightSpecular = vec4( LS[0], LS[1], LS[2], 1.0 );

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    // normal matrix only really need if there is nonuniform scaling
    // it's here for generality but since there is
    // no scaling in this example we could just use modelView matrix in shaders

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
   
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	
	gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
    gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
    gl.uniform4fv( specularProductLoc, flatten(specularProduct) );
    gl.uniform4fv( lightPositionLoc, flatten(lightPosition) );

    gl.uniform1f( shininessLoc, materialShininess );
	
    for( var i=0; i<index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );
	
    window.requestAnimFrame(render);
}
