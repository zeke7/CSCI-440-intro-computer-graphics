"use strict";

var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

var Cfilled = -1 ;
var drawtri;
var drawline;
var drawrc;

var first = true;
var diffOptions = 0;
var t, t1, t2, t3, t4;

var vertice = 1;
var rcvertice = 1;
var cIndex = 0;
var vertice2 = 0;

var numPolygons = 0;
var numIndices = [];

var start = [0];
start[0] = 0;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);



    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var m = document.getElementById("mymenu");

    m.addEventListener("click", function() {
       cIndex = m.selectedIndex;
        });


    
    document.getElementById("Controls").onclick = function(event) {

        if (event.target.index === 0) {
            canvas.removeEventListener("mousedown", drawtri);
            canvas.removeEventListener("mousedown", drawrc);
            canvas.addEventListener("mousedown", drawline = function (event) {

                numIndices[numPolygons] = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                if (first) {
                    first = false;
                    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                    t1 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                } else {

                    first = true;
                    t2 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t1));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(t2));
                    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                    index += 2;

                    t = vec4(colors[cIndex]);

                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 2), flatten(t));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 1), flatten(t));

                    numIndices[numPolygons] = 2;
                    numPolygons++;
                }
                start[numPolygons] = index;

            });
        }

      else if (event.target.index === 1) {
            canvas.removeEventListener("mousedown", drawline);
            canvas.removeEventListener("mousedown", drawrc);
            canvas.addEventListener("mousedown", drawtri = function (event) {
                numIndices[numPolygons] = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                if (vertice === 1) {
                    vertice = 2;
                    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                    t1 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                }
                else if (vertice === 2) {
                    vertice = 3;
                    t2 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                }
                else if (vertice === 3) {
                    vertice = 1;
                    t3 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t1));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(t2));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 2), flatten(t3));
                    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                    index += 3;
                    var t = vec4(colors[cIndex]);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 3), flatten(t));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 2), flatten(t));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 1), flatten(t));

                    numIndices[numPolygons] = 3;
                    numPolygons++;

                }
                start[numPolygons] = index;

            }, false);
        }

        else if(event.target.index === 2){
            canvas.removeEventListener("mousedown", drawline);
            canvas.removeEventListener("mousedown", drawtri);
            canvas.addEventListener("mousedown", drawrc = function (event) {
                numIndices[numPolygons] = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                if (rcvertice === 1) {
                    rcvertice = 2;
                    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                    t1 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                }
                else if (rcvertice === 2) {
                    rcvertice = 3;
                    t2 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                }
                else if (rcvertice === 3) {
                    rcvertice = 4;
                    t3 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                }
                else if (rcvertice === 4) {
                    rcvertice = 1;
                    t4 = vec2(2 * event.clientX / canvas.width - 1,
                        2 * (canvas.height - event.clientY) / canvas.height - 1);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t1));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(t2));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 2), flatten(t3));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 3), flatten(t4));
                    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                    index += 4;
                    var t = vec4(colors[cIndex]);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 4), flatten(t));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 3), flatten(t));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 2), flatten(t));
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 1), flatten(t));

                    numIndices[numPolygons] = 4;
                    numPolygons++;

                }
                start[numPolygons] = index;

            }, false);


        }

        };
        document.getElementById("filled").onclick = function (event) {
            Cfilled = (-1) * Cfilled;
            if(Cfilled < 0){
                render();
            }else {
                renderNFilled();
            }
        };

    render();

    };



function renderNFilled() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    for (var i = 0; i <= numPolygons; i++) {

        if( start[i+1] - start[i] === 2) {
            gl.drawArrays(gl.LINE_LOOP, start[i], numIndices[i]);
        }
        else if( start[i+1] - start[i]  === 3) {
            gl.drawArrays(gl.LINE_LOOP, start[i], numIndices[i]);
        }
        else if (start[i+1] - start[i]  === 4){
            gl.drawArrays(gl.LINE_LOOP, start[i], numIndices[i]);
        }
    }
    window.requestAnimFrame(renderNFilled);

}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

        for (var i = 0; i <= numPolygons; i++) {

                if( start[i+1] - start[i] === 2) {
                    gl.drawArrays(gl.LINE_LOOP, start[i], numIndices[i]);
                }
                else if( start[i+1] - start[i]  === 3) {
                    gl.drawArrays(gl.TRIANGLES, start[i], numIndices[i]);
                }
                else if ((start[i+1] - start[i])  % 4 ===0){
                     gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
                }
        }
    window.requestAnimFrame(render);

}

