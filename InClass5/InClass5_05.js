"use strict";

var gl;

var nRows = 50;
var nColumns = 50;

// data for radial hat function: sin(Pi*r)/(Pi*r)
var data = [];
for( var i = 0; i < nRows; ++i ) {
    data.push( [] );
    var x = Math.PI*(7*i/nRows-2.0);

    for( var j = 0; j < nColumns; ++j ) {
        var y = Math.PI*(7*j/nRows-2.0);
        var r = Math.sqrt(x*x+y*y);

        // take care of 0/0 for r = 0

        data[i][j] = r ? Math.sin(r) / r : 1.0;
    }
}

var pointsArray = [];

var near = -5.0;
var far = 5.0;
var left = -1.0;
var right = 0.9;
var ytop = 2.0;
var bottom = -1.0;
var dr = 0.1;

var droneleftright = 0;
var droneupdown = 0.5;
var dronefb = 1.0;
var dronehome = true;

var lookupdown = 0;
var looklr = 0;
var lookfb = 0;
var lookhome = true;


var eye = vec3(0.0, 0.5, 1.0); 
var at  = vec3(0.0, 0.0, 0.0);
var up  = vec3(0.0, 1.0, 0.0);

var fColor;
const black = vec4(0.0, 0.0, 0.0, 1.0);
const land = vec4(0.0, 0.7, 0.3, 0.9);

var modeViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.0, 0.0, 0.9, 0.3 );

    // enable depth testing and polygon offset
    // so lines will be in front of filled triangles

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

	// vertex array of nRows*nColumns quadrilaterals
	// (two triangles/quad) from data

    for(var i=0; i<nRows-1; i++) {
        for(var j=0; j<nColumns-1;j++) {
            pointsArray.push( vec4(2*i/nRows-1, data[i][j], 2*j/nColumns-1, 1.0));
            pointsArray.push( vec4(2*(i+1)/nRows-1, data[i+1][j], 2*j/nColumns-1, 1.0));
            pointsArray.push( vec4(2*(i+1)/nRows-1, data[i+1][j+1], 2*(j+1)/nColumns-1, 1.0));
            pointsArray.push( vec4(2*i/nRows-1, data[i][j+1], 2*(j+1)/nColumns-1, 1.0) );
		}
	}
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColor = gl.getUniformLocation(program, "fColor");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    document.getElementById("Button1").onclick = function(){droneupdown += dr;};
    document.getElementById("Button2").onclick = function(){droneupdown -= dr;};

    document.getElementById("Button3").onclick = function(){dronefb -= dr;};
    document.getElementById("Button4").onclick = function(){dronefb += dr;};

    document.getElementById("Button5").onclick = function(){droneleftright -= dr;};
    document.getElementById("Button6").onclick = function(){droneleftright += dr;};

    document.getElementById("Button7").onclick = function(){lookupdown += dr;};
    document.getElementById("Button8").onclick = function(){lookupdown -= dr;};

    document.getElementById("Button9").onclick = function(){lookfb -= dr;};
    document.getElementById("Button10").onclick = function(){lookfb += dr;};

    document.getElementById("Button11").onclick = function(){looklr -= dr;};
    document.getElementById("Button12").onclick = function(){looklr += dr;};

    document.getElementById("Button13").onclick = function(){near  *= 0.9; far *= 0.9;left *=0.9; right*=0.9;ytop*=0.9;bottom*=0.9;};
    document.getElementById("Button14").onclick = function(){near  *= 1.1; far *= 1.1;left *=1.1; right*=1.1;ytop*=1.1;bottom*=1.1};

    document.getElementById("Button15").onclick = function(){lookhome = !lookhome};
    document.getElementById("Button16").onclick = function(){dronehome = !dronehome};
        

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(dronehome){
        eye = vec3(droneleftright,droneupdown,dronefb);
        
    }else{
        droneleftright = 0.0;
        droneupdown = 0.5;
        dronefb = 1.0;
        eye = vec3(droneleftright,droneupdown,dronefb);
        dronehome = !dronehome;
    }

    if(lookhome){
        at = vec3(looklr,lookupdown,lookfb);
    }else{
        lookfb = 0.0;
        lookupdown = 0.0;
        looklr = 0.0;
        at = vec3(looklr,lookupdown,lookfb);
        lookhome = !lookhome;
    }


        
    var modelViewMatrix = lookAt( eye, at, up );
    var projectionMatrix = ortho( left, right, bottom, ytop, near, far );

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    // draw each quad then two black line loops
    
    for(var i=0; i<pointsArray.length; i+=4) {
        gl.uniform4fv(fColor, flatten(land));
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
        gl.uniform4fv(fColor, flatten(black));
        gl.drawArrays( gl.LINE_LOOP, i, 4 );
    }

    requestAnimFrame(render);
}
