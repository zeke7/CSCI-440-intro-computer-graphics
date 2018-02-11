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
var expOrNot = true;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    

        //colorCubes();
        colorCubes();
        colorCubef();
        colorCubeNotFills();
        colorCubeNotFillf();

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
    var f = document.getElementById("Faces");
    f.onclick = function (event) {
        faceOrNot = !faceOrNot;
    };
    
    var ex = document.getElementById("Explode");
    ex.onclick = function (event) {
        expOrNot = !expOrNot;
    };

    render();
}

function colorCubef(){

    quadf( 1, 0, 3, 2 );
    quadf( 2, 3, 7, 6 );
    quadf( 3, 0, 4, 7 );
    quadf( 6, 5, 1, 2 );
    quadf( 4, 5, 6, 7 );
    quadf( 5, 4, 0, 1 );
}

function quadf(a, b, c, d)
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

   var indices = [ a, b, c, a,c,d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[indices[i]] );
        
    }
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

   var indices = [ a, b, c, a,c,d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[a]);
    
    }
}

function colorCubeNotFills(){

    quadNotFills( 7,6,5,4 );
    quadNotFills( 7,4,0,3 );
    quadNotFills( 7,3,2,6 );
    quadNotFills( 6,2,1,5 );
    quadNotFills( 5,1,0,4 );
    
    
   
}


function quadNotFills(a, b, c, d)
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

   var indices = [ a, b, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
       
        //colors.push( vertexColors[indices[i]] );
        colors.push(vertexColors[b]);
    
    }
}

function colorCubeNotFillf(){

    quadNotFillf( 7,6,5,4 );
    quadNotFillf( 7,4,0,3 );
    quadNotFillf( 7,3,2,6 );
    quadNotFillf( 6,2,1,5 );
    quadNotFillf( 5,1,0,4 );
    
    
   
}

function quadNotFillf(a, b, c, d)
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

   var indices = [ a, b, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[indices[i]] );
    }
}

function onlyOne() {
    modelViewMatrix = mat4();
    // modelViewMatrix = mult(modelViewMatrix, translate(0.0,0.5,0.0));
    // modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function topleft() {
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-0.5,0.5,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function midleft() {
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-0.5,0.0,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function downleft(){
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-0.5,-0.5,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function topmid(){
    // top - mid
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0,0.5,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function midmid(){
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0,0.0,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function downmid(){
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0,-0.5,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function topright(){
     modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0.5,0.5,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}
function midright(){
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0.5,0.0,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}
function downright(){
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0.5,-0.5,0.0));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.25,1.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}



function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(PauseOrNot) {
        theta = theta;
    }else{
        theta += 2;
    }

    

    if(expOrNot){
        if(FillOrNot){
            if(faceOrNot){
            
            onlyOne();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
        }else{
            
            onlyOne();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
        }
    }else{
        if(faceOrNot){
            
            onlyOne();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
        }else{
            
            onlyOne();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
        }
    }
    }else{



    
    if(FillOrNot){
        if(faceOrNot){
            topleft();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
            midleft();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
            downleft();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
            topmid();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
            midmid();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
            downmid();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
            topright();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
            midright();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
            downright();
            gl.drawArrays( gl.LINE_STRIP, 72, 20 );
        }else{
            topleft();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
            midleft();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
            downleft();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
            topmid();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
            midmid();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
            downmid();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
            topright();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
            midright();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
            downright();
            gl.drawArrays( gl.LINE_STRIP, 92, 20 );
        }
    }else{
        if(faceOrNot){
            topleft();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            midleft();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            downleft();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            topmid();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            midmid();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            downmid();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            topright();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            midright();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            downright();
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
        }else{
            topleft();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
            midleft();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
            downleft();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
            topmid();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
            midmid();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
            downmid();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
            topright();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
            midright();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
            downright();
            gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
        }
    }
    
    }
    requestAnimFrame( render );
}
