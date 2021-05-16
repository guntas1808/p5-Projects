var setMethods = function(p){
    p.loading_text = "Loading";

    p.cartesian_bounds = {
        x_max:0.7,
        x_min:-2,
        y_max:1.35,
        y_min:-1.35,
    };

    p.canvas = null;
    p.isMandelBrot = true;

    p.setup = function(){
        p.noLoop();
        var div_width = document.getElementById("sketchContainer").offsetWidth;
        console.log(div_width);
        p.pixelDensity(1);
        if(p.canvas == null){
            p.createCanvas(div_width, div_width);
        }
        
        p.background(200)
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(32);
        p.text(p.loading_text + ". . . ", (p.width/2) - p.textWidth("Loading. . . ")/2, p.height/2);
        
        if(p.isMandelBrot){
            p.plotMandelBrot(div_width, div_width, p.cartesian_bounds);
        }else{
            p.plotJulia(div_width, div_width, p.cartesian_bounds);
        }
        
    };

    p.draw = function(){
        var div_width = document.getElementById("sketchContainer").offsetWidth;
        p.resizeCanvas(div_width, div_width);
        p.image(p.canvas, 0, 0, p.width, p.height);
    };

    p.plotMandelBrot = function(arg_width, arg_height, cartesian_bounds){
        p.isMandelBrot = true;
        
        p.background(200)
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(32);
        p.text(p.loading_text + ". . . ", (p.width/2) - p.textWidth("Loading. . . ")/2, p.height/2);
        
        
        p.canvas = p.createGraphics(arg_width, arg_height);
    
        const mb = new MandelBrotPlot(arg_width,
            arg_width,
            parseInt(document.getElementById('iterations_mandelbrot').value),
            parseInt(document.getElementById('upper_bound_mandelbrot').value),
            cartesian_bounds
            );
        
        var worker = new Worker('MandelBrotWorker.js');
    
        console.log("parent , sending message, mb.computed = " + mb.computed);
        
        worker.postMessage(mb);
        
        worker.onmessage = function(event){
            console.log("parent, message recieved, mb.computed = " + event.data.computed);
            
            p.canvas.pixelDensity(1);
            p.canvas.loadPixels();
            for(var i = 0; i<p.canvas.pixels.length ; ++i){
                p.canvas.pixels[i] = event.data.pixels[i];
            }
            p.canvas.updatePixels();
            console.log("Pixels Upadted");
            // console.log(canvas.pixels);
            // p.noLoop();
            console.log("Painting pixels");
            p.clear();
            p.image(p.canvas, 0, 0);
            p.loop();
        };
    };

    p.plotMandelBrotUtil = function(){
        if(!p.isMandelBrot){
            p.cartesian_bounds = {
                x_max:0.7,
                x_min:-2,
                y_max:1.35,
                y_min:-1.35,
            };

            p.isMandelBrot = true;
        }
        
        p.setup();
    };

    p.plotJulia = function(arg_width, arg_height, cartesian_bounds){
        p.isMandelBrot = false;

        p.background(200)
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(32);
        p.text(p.loading_text + ". . . ", (p.width/2) - p.textWidth("Loading. . . ")/2, p.height/2);
        
        
        p.canvas = p.createGraphics(arg_width, arg_height);
        
        var c_real_part;
        var c_complex_part;
        if(document.getElementById("cartesian").checked){
            c_real_part = parseFloat(document.getElementById('c_real').value);
            c_complex_part = parseFloat(document.getElementById('c_complex').value);
        }else{
            var r = parseFloat(document.getElementById('c_r').value);
            var theta = Math.PI*parseFloat(document.getElementById('c_theta').value);
            c_real_part = r*Math.cos(theta);
            c_complex_part = r*Math.sin(theta);
        }

        var c = {
            real_part:c_real_part,
            complex_part: c_complex_part
        }
        const j = new JuliaPlot(arg_width,
            arg_width,
            parseInt(document.getElementById('iterations_julia').value),
            parseInt(document.getElementById('upper_bound_julia').value),
            cartesian_bounds,
            c
            );
        
        var worker = new Worker('JuliaWorker.js');
    
        console.log("parent , sending message, j.computed = " + j.computed);
        
        worker.postMessage(j);
        
        worker.onmessage = function(event){
            console.log("parent, message recieved, j.computed = " + event.data.computed);
            
            p.canvas.pixelDensity(1);
            p.canvas.loadPixels();
            for(var i = 0; i<p.canvas.pixels.length ; ++i){
                p.canvas.pixels[i] = event.data.pixels[i];
            }
            p.canvas.updatePixels();
            console.log("Pixels Upadted");
            // console.log(canvas.pixels);
            // p.noLoop();
            console.log("Painting pixels");
            p.clear();
            p.image(p.canvas, 0, 0);
            p.loop();
        };
    };

    p.plotJuliaUtil = function(){
        p.isMandelBrot = false;
        
        p.cartesian_bounds = {
            x_max:1.35,
            x_min:-1.35,
            y_max:1.35,
            y_min:-1.35,
        };

        p.setup();
    };

    p.zoomIn = function(x, y){
        var scale = 1/document.getElementById('scaling_factor').value;
        console.log("scaling by "+ scale);
        var range_x = scale*(p.cartesian_bounds.x_max - p.cartesian_bounds.x_min);
        var range_y = scale*(p.cartesian_bounds.y_max - p.cartesian_bounds.y_min) 
        var x_ = p.map(x, 0, p.width, p.cartesian_bounds.x_min, p.cartesian_bounds.x_max)
        var y_ = p.map(y, 0, p.height, p.cartesian_bounds.y_max, p.cartesian_bounds.y_min);
        p.cartesian_bounds.x_max = x_ + range_x/2;
        p.cartesian_bounds.x_min = x_ - range_x/2;
        p.cartesian_bounds.y_max = y_ + range_y/2;
        p.cartesian_bounds.y_min = y_ - range_y/2;
        
        if(p.isMandelBrot){
            p.plotMandelBrot(p.width, p.height, p.cartesian_bounds);
        }else{
            p.plotJulia(p.width, p.height, p.cartesian_bounds);
        }

    };

    p.zoomOut = function(){
        var scale = document.getElementById('scaling_factor').value;
        console.log("scaling by "+ scale);
        var range_x = scale*(p.cartesian_bounds.x_max - p.cartesian_bounds.x_min);
        var range_y = scale*(p.cartesian_bounds.y_max - p.cartesian_bounds.y_min);
        var x = (p.cartesian_bounds.x_min + p.cartesian_bounds.x_max)/2;
        var y = (p.cartesian_bounds.y_max + p.cartesian_bounds.y_min)/2;
        p.cartesian_bounds.x_max = x + range_x/2;
        p.cartesian_bounds.x_min = x - range_x/2;
        p.cartesian_bounds.y_max = y + range_y/2;
        p.cartesian_bounds.y_min = y - range_y/2;
        
        if(p.isMandelBrot){
            p.plotMandelBrot(p.width, p.height, p.cartesian_bounds);
        }else{
            p.plotJulia(p.width, p.height, p.cartesian_bounds);
        }


    }

    p.resetScaling = function(){
        
        if(p.isMandelBrot){
            p.cartesian_bounds = {
                x_max:0.7,
                x_min:-2,
                y_max:1.35,
                y_min:-1.35,
            };
            p.plotMandelBrot(p.width, p.height, p.cartesian_bounds);
        }else{
            p.cartesian_bounds = {
                x_max:1.35,
                x_min:-1.35,
                y_max:1.35,
                y_min:-1.35,
            };
            p.plotJulia(p.width, p.height, p.cartesian_bounds);
        }
    
    };
        
}

var sketch = new p5(setMethods, 'sketchContainer');