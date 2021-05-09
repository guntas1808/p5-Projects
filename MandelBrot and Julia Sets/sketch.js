//iterating variables
var realPart;
var complexPart;
var realPartNext;
var complexPartNext;
var iterations;

//pixel variables
var pixelIndex;
var colorVal;

//Plot parameters
var upperBound;
var cReal;
var cComplex;

//scaling variables for MandelBrot
var newWidth;
var newHeight;
var xMax = 0.7;
var xMin = -2;
var yMax = 1.35;
var yMin = -1.35;
var isJulia;

function setup() {
    console.log(width);
    isJulia = false;
    plotMandelBrot();
}

function draw() {
    console.log(width);
 // put drawing code here
}

function plotMandelBrot(){
    isJulia = false;
    createCanvas(innerWidth,innerWidth);
    iterations = parseInt(document.getElementById('iterationsMB').value);
    upperBound = parseInt(document.getElementById('upperBoundMB').value);
    //load pixel array
    pixelDensity(1);
    loadPixels();
    
    for(let x=0;x<width;x++){
        for(let y=0;y<height;y++){
            var x_ = map(x,0,width,xMin,xMax);
            var y_ = map(y,0,height,yMax, yMin);
            colorVal = mandelBrotSet(iterations,upperBound,x_,y_);
            
            pixelIndex = (x + y*width)*4;
            if(colorVal>255){
                pixels[pixelIndex + 0] = 255;
                pixels[pixelIndex + 1] = 118;
                pixels[pixelIndex + 2] = 40;
                pixels[pixelIndex + 3] = 255;
            }else{
                pixels[pixelIndex + 0] = colorVal;
                pixels[pixelIndex + 1] = colorVal;
                pixels[pixelIndex + 2] = colorVal;
                pixels[pixelIndex + 3] = 255;
            }
        }
    }
    updatePixels();
}

function plotJulia(){
    createCanvas(innerWidth, innerWidth);
    iterations = parseInt(document.getElementById('iterationsJulia').value);
    upperBound = parseInt(document.getElementById('upperBoundJulia').value);
    if(document.getElementById("cartesian").checked){
        cReal = parseFloat(document.getElementById('cReal').value);
        cComplex = parseFloat(document.getElementById('cComplex').value);
    }else{
        var r = parseFloat(document.getElementById('cR').value);
        var theta = PI*parseFloat(document.getElementById('cTheta').value);
        cReal = r*cos(theta);
        cComplex = r*sin(theta);
    }
    //load pixel array
    pixelDensity(1);
    loadPixels();
    for(let x=0;x<width;x++){
        for(let y=0;y<height;y++){
                var x_ = map(x,0,width,-1.7,1.7);
                var y_ = map(y,0,height,1.7,-1.7);
                colorVal = 
                juliaSet(100,50,cReal,cComplex,x_,y_)

                pixelIndex = (x + y*width)*4;
                if(colorVal>255){
                    pixels[pixelIndex + 0] = 255;
                    pixels[pixelIndex + 1] = 118;
                    pixels[pixelIndex + 2] = 40;
                    pixels[pixelIndex + 3] = 255;
                }else{
                    pixels[pixelIndex + 0] = colorVal;
                    pixels[pixelIndex + 1] = colorVal;
                    pixels[pixelIndex + 2] = colorVal;
                    pixels[pixelIndex + 3] = 255;
                }
        }
    }
    updatePixels();
    isJulia = true;
}

function mandelBrotSet(iterations, upperBound, cRealPart, cComplexPart){
    realPart = 0;
    complexPart = 0;
    for(var i =1;i<=iterations;i++){
        realPartNext = (realPart*realPart - complexPart*complexPart) + cRealPart;
        complexPartNext = (2*realPart*complexPart) + cComplexPart;   //Z(n+1) = Z(n)*Z(n) + c
        
        realPart = realPartNext;
        complexPart = complexPartNext;
        
        if(sqrt(realPartNext*realPartNext + complexPartNext*complexPartNext)>upperBound){
            break;
        }
    }
    let colorVal = map(i,1,iterations,0,255);
    return colorVal;
}

function juliaSet(iterations, upperBound, cRealPart, cComplexPart, x, y){
    realPart = x;
    complexPart = y;
    for(var i =1;i<=iterations;i++){
        realPartNext = (realPart*realPart - complexPart*complexPart) + cRealPart;
        complexPartNext = (2*realPart*complexPart) + cComplexPart;   //Z(n+1) = Z(n)*Z(n) + c
        
        realPart = realPartNext;
        complexPart = complexPartNext;
        
        if(sqrt(realPartNext*realPartNext + complexPartNext*complexPartNext)>upperBound){
            break;
        }
    }
    let colorVal = map(i,1,iterations,0,255);
//    if(colorVal>100){ 
//        console.log(colorVal);
//    }
    return colorVal;
}

function reset(){
    xMax = 0.7;
    xMin = -2;
    yMax = 1.35;
    yMin = -1.35;
    plotMandelBrot();
}

function doubleClicked(){
    var mouseX_ = map(mouseX, 0, width, xMin, xMax);
    var mouseY_ = map(mouseY, 0, height, yMax, yMin);
    var scale = parseFloat(document.getElementById("scalingFactor").value)
    console.log(scale);
    xMax = mouseX_ + ((xMax-xMin)/scale)/2;
    xMin = mouseX_ - ((xMax-xMin)/scale)/2;
    yMax = mouseY_ + ((yMax-yMin)/scale)/2;
    yMin = mouseY_ - ((yMax-yMin)/scale)/2;
    plotMandelBrot();
}