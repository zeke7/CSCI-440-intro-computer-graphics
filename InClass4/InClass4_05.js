"use strict";

var canvas;
var gl;

var pointsArray = [];

var fColor;
var red;
var green;
var blue;
var cyan;
var black;
var white;

var modelViewMatrix;
var modelViewMatrixLoc; 

var theta1 = 0;
var theta2 = 0;
var theta3 = 0;

var theta4 = 0;
var theta5 = 0;
var theta6 = 0;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    red = vec4(1.0, 0.0, 0.0, 1.0);
	green = vec4(0.0, 1.0, 0.0, 1.0);
	blue = vec4(0.0, 0.0, 1.0, 1.0);
    cyan = vec4(0.0, 1.0, 1.0, 1.0);
    black = vec4(0.0,0.0,0.0,1.0);
    white = vec4(1.0,1.0,1.0,1.0);

    // square
	
 	pointsArray.push(vec4( -0.5, -0.5, 0.0, 1.0));
	pointsArray.push(vec4( -0.5,  0.5, 0.0, 1.0));
	pointsArray.push(vec4(  0.5,  0.5, 0.0, 1.0));
	pointsArray.push(vec4(  0.5, -0.5, 0.0, 1.0));
	
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColor = gl.getUniformLocation(program, "fColor");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    render();
}

var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // top - right
        modelViewMatrix = mat4();
        theta3 +=2;
        modelViewMatrix = mult(modelViewMatrix, translate(0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateZ(theta3));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(green));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        modelViewMatrix = mat4();
        theta2 -=2;
        modelViewMatrix = mult(modelViewMatrix, translate(0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateZ(theta2));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(blue));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        
		modelViewMatrix = mat4();
        theta1 +=2;
        modelViewMatrix = mult(modelViewMatrix, translate(0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.75,0.75,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateZ(theta1));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(red));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        // Down - left
        modelViewMatrix = mat4();
        theta6 +=2;
        modelViewMatrix = mult(modelViewMatrix, translate(-0.5,-0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateZ(theta3));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(green));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        modelViewMatrix = mat4();
        theta5 -=2;
        modelViewMatrix = mult(modelViewMatrix, translate(-0.5,-0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateZ(theta2));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(blue));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        
        modelViewMatrix = mat4();
        theta4 +=2;
        modelViewMatrix = mult(modelViewMatrix, translate(-0.5,-0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.75,0.75,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateZ(theta1));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(cyan));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	

        // Down - right
        
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(0.5,-0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateX(theta3));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(white));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(0.5,-0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateX(theta2));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(black));
        gl.drawArrays(gl.LINE_LOOP, 0, 4);

        //Top - right

        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(-0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateY(theta3));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(black));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(-0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, scalem(0.5,0.5,0.0));
        modelViewMatrix = mult(modelViewMatrix, rotateY(theta2));
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(white));
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
        
        
        
        requestAnimFrame(render);
    }
