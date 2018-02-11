"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 5;

var index = 0;

var pointsArray = [];
var normalsArray = [];
var ambientProductLoc,diffuseProductLoc,specularProductLoc,lightPositionLoc,materialShininessLoc;

var leftright = 1;
var fb = 1;
var updown =1;

var near = -10;
var far = 10;

var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;

var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var mValue = [0,0,0];


var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.0, 0.0, 0.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );


var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0.0, 0.0, 0.0, 1.0 );

var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialShininess = 20.0;
var ambientProduct = mult(lightAmbient, materialAmbient);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);
var specularProduct = mult(lightSpecular, materialSpecular);


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);



var Rtheta = 0;
var MD = [0,0,0];


var PauseOrNot = false;

var toRed = false;

var toGreen = false;

var toBlue = false;

var tocolor = true;
var backcolor = false;

var mush = true;
var backmush = false;
var lightSpecularLoc;

var singlecolor = false;
   
var detheta = 0;

var testcon = false;

function triangle(a, b, c) {

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

          // normals are vectors

     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);


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

    document.getElementById("Button0").onclick = function(){radius *= 2.0;};
    document.getElementById("Button1").onclick = function(){radius *= 0.5;};
    document.getElementById("Button2").onclick = function(){theta += dr;};
    document.getElementById("Button3").onclick = function(){theta -= dr;};
    document.getElementById("Button4").onclick = function(){phi += dr;};
    document.getElementById("Button5").onclick = function(){phi -= dr;};

    document.getElementById("Button6").onclick = function(){
        numTimesToSubdivide++;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
    document.getElementById("Button7").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
    document.getElementById("Button8").onclick = function(){updown += 0.1;};
    document.getElementById("Button9").onclick = function(){updown -= 0.1;};
    document.getElementById("Button10").onclick = function(){leftright -= 0.1;};
    document.getElementById("Button11").onclick = function(){leftright += 0.1;};
    document.getElementById("Button12").onclick = function(){fb += 0.1;};
    document.getElementById("Button13").onclick = function(){fb -= 0.1;};

   var p = document.getElementById("Button14");
    p.onclick = function (event) {
        PauseOrNot = !PauseOrNot;
    };

    var red = document.getElementById("Button15");
    red.onclick = function (event) {
        toRed = true;
        toGreen = false;
        toBlue = false;
    };
    
    var green = document.getElementById("Button16");
    green.onclick = function (event) {
        toGreen = true;
        toRed = false;
        toBlue = false;
        
    };
    
    var blue = document.getElementById("Button17");
    blue.onclick = function (event) {
        toBlue = true;
        toRed = false;
        toGreen = false;
        
    };

    var single = document.getElementById("Button18");
    single.onclick = function (event) {
        singlecolor = !singlecolor;
    };
    
    var mushs = document.getElementById("Button19");
    mushs.onclick = function (event) {
        testcon = !testcon;
    };

    var pause = document.getElementById("Button14");
    pause.onclick = function (event) {
        PauseOrNot =!PauseOrNot;
    };




    ambientProductLoc = gl.getUniformLocation(program,"ambientProduct");
    diffuseProductLoc = gl.getUniformLocation(program,"diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program,"specularProduct");
    lightPositionLoc = gl.getUniformLocation(program,"lightPosition");
    materialShininessLoc = gl.getUniformLocation(program,"materialShininess");
   
    
    render();
}

function adfun(){
                
                materialDiffuse = vec4( MD[0], MD[1], MD[2], 1.0 );
                ambientProduct = mult(lightAmbient, materialAmbient);
                diffuseProduct = mult(lightDiffuse, materialDiffuse);
}
function adfunr(){
                
                materialDiffuse = vec4( detheta,0,0, 1.0 );
                ambientProduct = mult(lightAmbient, materialAmbient);
                diffuseProduct = mult(lightDiffuse, materialDiffuse);
}
function adfung(){
                
                materialDiffuse = vec4( 0,detheta,0, 1.0 );
                ambientProduct = mult(lightAmbient, materialAmbient);
                diffuseProduct = mult(lightDiffuse, materialDiffuse);
}
function adfunb(){
                
                materialDiffuse = vec4( 0,0,detheta, 1.0 );
                ambientProduct = mult(lightAmbient, materialAmbient);
                diffuseProduct = mult(lightDiffuse, materialDiffuse);
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
            if(PauseOrNot){
                
                if (tocolor) {
                    detheta += 0.01;
                if( detheta >= 1){
                        tocolor = !tocolor;
                        backcolor = !backcolor;
                    }
                }
                if(backcolor){
                        detheta -= 0.01;
                    if( detheta <= 0){
                        tocolor = !tocolor;
                        backcolor = !backcolor;
                    }
            }
        }

            if(toRed){
                MD[0] = detheta;               
            }
            
            if (toGreen) {
                MD[1] = detheta;
                
            }
            if(toBlue){
                MD[2]=detheta;
            }


            adfun();
            if(singlecolor){
                if (toRed) {
                    adfunr();
                }
                if (toGreen) {
                    adfung();
                }
                if (toBlue) {
                    adfunb();
                }

            }
            
        if(testcon){
            if (mush) {
                near  *= 0.99; far *= 0.99;left *=0.99; right*=0.99;ytop*=0.99;bottom*=0.99;
                if(far <= 4){
                    mush = !mush;
                    backmush = !backmush;
                }
            }
            if(backmush){
                near  *= 1.01; far *= 1.01;left *=1.01; right*=1.01;ytop*=1.01;bottom*=1.01;
                if(far >= 15){
                    mush = !mush;
                    backmush = !backmush;
                }
            }
        }






    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    
    lightPosition = vec4(leftright, updown, fb, 0.0 );
    
    modelViewMatrix = lookAt(eye, at , up);

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    modelViewMatrix = mult(modelViewMatrix, rotateY(Rtheta));
        normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniform4fv(ambientProductLoc,ambientProduct);
    gl.uniform4fv(diffuseProductLoc,diffuseProduct );
    gl.uniform4fv(specularProductLoc,specularProduct );
    gl.uniform4fv(lightPositionLoc,lightPosition );
    gl.uniform1f(materialShininessLoc,materialShininess );

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    for( var i=0; i<index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    window.requestAnimFrame(render);
}
