"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;
var scaleXLoc;
var scaleYLoc;
var scaleZLoc;

var scaleX = 1;
var scaleY = 1;
var scaleZ = 1;

var tranXLoc;
var tranYLoc;
var tranZLoc;

var tranX = 0;
var tranY = 0;
var tranZ = 0;


var flag1 = true;
var flag2 = true;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    scaleXLoc = gl.getUniformLocation(program, "scaleX");
    scaleYLoc = gl.getUniformLocation(program, "scaleY");
    scaleZLoc = gl.getUniformLocation(program, "scaleZ");
	
    tranXLoc = gl.getUniformLocation(program, "tranX");
    tranYLoc = gl.getUniformLocation(program, "tranY");
    tranZLoc = gl.getUniformLocation(program, "tranZ");
    //event listeners for menus

	document.getElementById("Controls0" ).onclick = function(event) {
        switch( event.target.index ) {
         case 0:
            flag1 = !flag1;
            break;
         case 1:
            flag2 = !flag2;
            break;
       }
    };	
	document.getElementById("Controls1" ).onclick = function(event) {
        switch( event.target.index ) {
         case 0:
            axis = xAxis;
            break;
         case 1:
            axis = yAxis;
            break;
         case 2:
            axis = zAxis;
            break;
       }
    };
	document.getElementById("Controls2" ).onclick = function(event) {
        switch( event.target.index ) {
         case 0:
            tranX += 0.1;
            break;
         case 1:
            tranX -= 0.1;
            break;
         case 2:
            tranY += 0.1;
            break;
         case 3:
            tranY -= 0.1;
            break;
         case 4:
            tranZ += 0.1;
            break;
         case 5:
            tranZ -= 0.1;
            break;			
       }
    };
	document.getElementById("Controls3" ).onclick = function(event) {
        switch( event.target.index ) {
         case 0:
            scaleX +=0.1;
            break;
         case 1:
            scaleX -=0.1;
            break;
         case 2:
            scaleY +=0.1;
            break;
         case 3:
            scaleY -=0.1;
            break;
         case 4:
            scaleZ +=0.1;
            break;
         case 5:
            scaleZ -=0.1;
            break;			
       }
    };
    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
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

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        //colors.push(vertexColors[a]);
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (flag2){
		if(flag1) theta[axis] += 2.0;
		else	  theta[axis] -= 2.0;
	}
    
    gl.uniform3fv(thetaLoc, theta);
    
    gl.uniform1f(scaleXLoc, scaleX);
    gl.uniform1f(scaleYLoc, scaleY);
    gl.uniform1f(scaleZLoc, scaleZ);
    
    gl.uniform1f(tranXLoc, tranX);
    gl.uniform1f(tranYLoc, tranY);
    gl.uniform1f(tranZLoc, tranZ);
    


    
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    //gl.drawArrays( gl.LINES, 0, NumVertices );
    //gl.drawArrays( gl.TRIANGLE_STRIP, 0, NumVertices );
    // gl.drawArrays( gl.LINE_LOOP, 0, NumVertices );

    requestAnimFrame( render );
}
