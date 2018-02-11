"use strict";

var canvas;
var gl;
var program;

var numVertices  = 36;
var texSize = 256;
var numChecks = 8;

var textureA, textureB, textureC, textureD;

var c;

var flag = false;

var imageA = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255; 
            else c = 0; 
            imageA[4*i*texSize+4*j] = c;
            imageA[4*i*texSize+4*j+1] = c;
            imageA[4*i*texSize+4*j+2] = c;
            imageA[4*i*texSize+4*j+3] = 255; 
        }
    }

var imageB = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            imageB[4*i*texSize+4*j]   = 127+127*Math.sin(0.1*i*j);
            imageB[4*i*texSize+4*j+1] = 127+127*Math.sin(0.1*i*j);
            imageB[4*i*texSize+4*j+2] = 127+127*Math.sin(0.1*i*j);
            imageB[4*i*texSize+4*j+3] = 255;
           }
    }

var imageC = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255; 
            else c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
            imageC[4*i*texSize+4*j]   = c;
            imageC[4*i*texSize+4*j+1] = c;
            imageC[4*i*texSize+4*j+2] = c;
            imageC[4*i*texSize+4*j+3] = 255; 
        }
    }

// imageD defined here

var imageD = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255; 
            else c = 127; 
            imageD[4*i*texSize+4*j] = c;
            imageD[4*i*texSize+4*j+1] = c;
            imageD[4*i*texSize+4*j+2] = c;
            imageD[4*i*texSize+4*j+3] = 255; 
        }
    }


		
var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
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
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [45.0, 45.0, 45.0];
var thetaLoc;

function configureTexture() {
    textureA = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, textureA );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageA);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    textureB = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, textureB );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageB);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	textureC = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, textureC );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageC);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	// textureD defined here
	textureD = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, textureD );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageD);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[b]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[c]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[c]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[d]);
     texCoordsArray.push(texCoord[3]);
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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );


    configureTexture();

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, textureA );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0); //Initialize texture object 0 

    gl.activeTexture( gl.TEXTURE1 );
	gl.bindTexture( gl.TEXTURE_2D, textureA );
	gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1); //Initialize texture object 1
	
    thetaLoc = gl.getUniformLocation(program, "theta");

	document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
	document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
	document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
	document.getElementById("ButtonP").onclick = function(){flag = !flag;};

    document.getElementById("Controls1" ).onclick = function(event) {
        switch( event.target.index ) {
         case 0:
            gl.activeTexture( gl.TEXTURE0 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
            gl.bindTexture( gl.TEXTURE_2D, textureA );
            gl.activeTexture( gl.TEXTURE1 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
            gl.bindTexture( gl.TEXTURE_2D, textureA );
            break;
         case 1:
            gl.activeTexture( gl.TEXTURE0 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
            gl.bindTexture( gl.TEXTURE_2D, textureB );
            gl.activeTexture( gl.TEXTURE1 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
            gl.bindTexture( gl.TEXTURE_2D, textureB );
            break;
         case 2:
            gl.activeTexture( gl.TEXTURE0 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
            gl.bindTexture( gl.TEXTURE_2D, textureC );
            gl.activeTexture( gl.TEXTURE1 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
            gl.bindTexture( gl.TEXTURE_2D, textureC );
            break;
         case 3:
            gl.activeTexture( gl.TEXTURE0 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
            gl.bindTexture( gl.TEXTURE_2D, textureA );
            gl.activeTexture( gl.TEXTURE1 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
            gl.bindTexture( gl.TEXTURE_2D, textureB );
            break;
         case 4:
            gl.activeTexture( gl.TEXTURE0 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
            gl.bindTexture( gl.TEXTURE_2D, textureB );
            gl.activeTexture( gl.TEXTURE1 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
            gl.bindTexture( gl.TEXTURE_2D, textureD );
            break;
         case 5:
            gl.activeTexture( gl.TEXTURE0 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
            gl.bindTexture( gl.TEXTURE_2D, textureC );
            gl.activeTexture( gl.TEXTURE1 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
            gl.bindTexture( gl.TEXTURE_2D, textureD );
            break;          
       }
    };
    // gl.activeTexture( gl.TEXTURE0 );
    // gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
    // gl.bindTexture( gl.TEXTURE_2D, textureA );
    // gl.activeTexture( gl.TEXTURE1 );
    // gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
    // gl.bindTexture( gl.TEXTURE_2D, textureA );
    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;
	gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}
