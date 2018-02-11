"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];


var theta = 0;
var axis = 0;

var modelViewMatrix;
var modelViewMatrixLoc; 

var PauseOrNot = false;
var FillOrNot = false;
var faceOrNot = true;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    var f = document.getElementById("Faces");
    f.onclick = function (event) {
        faceOrNot = !faceOrNot;
    };

        colorCubes();
   
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

    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    var p = document.getElementById("Rotate");
    p.onclick = function (event) {
        PauseOrNot = !PauseOrNot;
    };
    var fill = document.getElementById("Fill");
    fill.onclick = function (event) {
        FillOrNot = !FillOrNot;
    };
    
   

    render();
}


function colorCubes(){

    quads( 1, 0, 3, 2 );
    quads( 2, 3, 7, 6 );
    quads( 3, 0, 4, 7 );
    quads( 6, 5, 1, 2 );
    quads( 4, 5, 6, 7 );
    quads( 5, 4, 0, 1 );
}

function quads(a, b, c, d)
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

   var indices = [ a, b, c, a, b, c ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        if(faceOrNot){
        colors.push( vertexColors[indices[i]] );
        }else{
        colors.push(vertexColors[a]);
    }
    }
}



function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(PauseOrNot) {
        theta = theta;
    }else{
        theta += 2;
    }

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
    if(FillOrNot){
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, NumVertices );
    }else{
     gl.drawArrays( gl.LINE_STRIP, 0, NumVertices );
    }
    requestAnimFrame( render );
}
