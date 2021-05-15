// import MandelBrotPlot from "MandelBrotPlot.js"


// function draw() {
//     console.log(innerWidth);
//  // put drawing code here
// }

// function reset(){
//     xMax = 0.7;
//     xMin = -2;
//     yMax = 1.35;
//     yMin = -1.35;
// }

// function doubleClicked(){
//     var mouseX_ = map(mouseX, 0, width, xMin, xMax);
//     var mouseY_ = map(mouseY, 0, height, yMax, yMin);
//     var scale = parseFloat(document.getElementById("scalingFactor").value)
//     console.log(scale);
//     xMax = mouseX_ + ((xMax-xMin)/scale)/2;
//     xMin = mouseX_ - ((xMax-xMin)/scale)/2;
//     yMax = mouseY_ + ((yMax-yMin)/scale)/2;
//     yMin = mouseY_ - ((yMax-yMin)/scale)/2;
// }


var sketch = function(p){
    p.setup = function(){
        var div_width = document.getElementById("sketchContainer").offsetWidth;
        console.log(div_width);
        p.pixelDensity(1);
        p.createCanvas(div_width, div_width);
        p.background(100)
        p.plotMandelBrot(div_width, div_width, 0.7, -2, 1.35, -1.35);
        p.noLoop();
        
        // var cReal;
        // var cComplex;
        // if(document.getElementById("cartesian").checked){
        //     cReal = parseFloat(document.getElementById('cReal').value);
        //     cComplex = parseFloat(document.getElementById('cComplex').value);
        // }else{
        //     var r = parseFloat(document.getElementById('cR').value);
        //     var theta = PI*parseFloat(document.getElementById('cTheta').value);
        //     cReal = r*cos(theta);
        //     cComplex = r*sin(theta);
        // }
        // var jul = new JuliaPlot(innerWidth,
        //                         innerWidth,
        //                         parseInt(document.getElementById('iterationsJulia').value),
        //                         parseInt(document.getElementById('upperBoundJulia').value),
        //                         cReal,
        //                         cComplex
        //                         );
        
        
        // var new_pixels = mb.plot();
        // for(var i=srv
        
    };
    p.plotMandelBrot = function(arg_width, arg_height, x_max, x_min, y_max, y_min){
        var canvas = p.createGraphics(arg_width, arg_height);
    
        const mb = new MandelBrotPlot(arg_width,
            arg_width,
            parseInt(document.getElementById('iterationsMB').value),
            parseInt(document.getElementById('upperBoundMB').value),
            x_max,
            x_min,
            y_max,
            y_min
            );
        
        var worker = new Worker('MandelBrotWorker.js');
    
        console.log("parent , sending message, mb.computed = " + mb.computed);
        
        worker.postMessage(mb);
        
        worker.onmessage = function(event){
            console.log("parent, message recieved, mb.computed = " + event.data.computed);
            
            canvas.pixelDensity(1);
            canvas.loadPixels();
            for(var i = 0; i<canvas.pixels.length ; ++i){
                canvas.pixels[i] = event.data.pixels[i];
            }
            canvas.updatePixels();
            console.log("Pixels Upadted");
            p.image(canvas, 0, 0);
        };
    }
    
    
}

new p5(sketch, 'sketchContainer');