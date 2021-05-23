let setMethods = function(p){
    p.loading_text = "Loading";

    p.cartesian_bounds = {
        x_max:0.7,
        x_min:-2,
        y_max:1.35,
        y_min:-1.35,
    };

    p.canvas = null;
    p.isMandelBrot = true;

    p.div_height = document.getElementById("sketch-container").offsetHeight;
    p.div_width = document.getElementById("sketch-container").offsetWidth;

    p.setup = function(){
        p.noLoop();
        p.div_width = document.getElementById("sketch-container").offsetWidth;
        p.div_height = document.getElementById("sketch-container").offsetHeight;
        
        p.adjustCartesianBounds();

        console.log(p.div_width, p.div_height);
        p.pixelDensity(1);

        if(p.canvas == null){
            p.createCanvas(p.div_width, p.div_height);
        }else{
            p.resizeCanvas(p.div_width, p.div_height);
        }

        console.log("Div dimensions : ", p.div_width, p.div_height);
        p.background(200)
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(32);
        p.text(p.loading_text + ". . . ", (p.width/2) - p.textWidth("Loading. . . ")/2, p.height/2);
        
        if(p.isMandelBrot){
            p.plotMandelBrot(p.div_width, p.div_height, p.cartesian_bounds);
        }else{
            p.plotJulia(p.div_width, p.div_height, p.cartesian_bounds);
        }
        
    };

    p.draw = function(){
        p.div_width = document.getElementById("sketch-container").offsetWidth;
        p.div_height = document.getElementById("sketch-container").offsetHeight;
        p.resizeCanvas(p.div_width, p.div_height);
        p.image(p.canvas, 0, 0, p.width, p.height);
    };

    p.adjustCartesianBounds = function(){
        if(p.isMandelBrot){
            p.cartesian_bounds = {
                x_max:0.7,
                x_min:-2,
                y_max:1.35,
                y_min:-1.35,
            };
        }else{
            p.cartesian_bounds = {
                x_max:1.35,
                x_min:-1.35,
                y_max:1.35,
                y_min:-1.35,
            };
        }

        let cartesian_width;
        let mid;
        if(p.div_height < p.div_width){
            console.log("height < width");
            cartesian_width = (p.cartesian_bounds.y_max-p.cartesian_bounds.y_min)*(p.div_width/p.div_height);
            mid =(p.cartesian_bounds.x_max + p.cartesian_bounds.x_min)/2;
            p.cartesian_bounds.x_max = mid + cartesian_width/2;
            p.cartesian_bounds.x_min = mid - cartesian_width/2;
        }else{
            console.log("height >= width");
            cartesian_width = (p.cartesian_bounds.x_max-p.cartesian_bounds.x_min)*(p.div_height/p.div_width);
            mid =(p.cartesian_bounds.y_max + p.cartesian_bounds.y_min)/2;
            p.cartesian_bounds.y_max = mid + cartesian_width/2;
            p.cartesian_bounds.y_min = mid - cartesian_width/2;
        }
    }

    p.plotMandelBrot = function(arg_width, arg_height, cartesian_bounds){
        p.isMandelBrot = true;
        
        p.background(200)
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(32);
        p.text(p.loading_text + ". . . ", (p.width/2) - p.textWidth("Loading. . . ")/2, p.height/2);
        
        
        p.canvas = p.createGraphics(arg_width, arg_height);
    
        const mb = new MandelBrotPlot(
            arg_height,
            arg_width,
            parseInt(document.getElementById('iterations-mb').value),
            parseInt(document.getElementById('upper-bound-mb').value),
            cartesian_bounds
            );
        
        let worker = new Worker('MandelBrotWorker.js');
    
        console.log("parent , sending message, mb.computed = " + mb.computed);
        
        worker.postMessage(mb);
        
        worker.onmessage = function(event){
            console.log("parent, message recieved, mb.computed = " + event.data.computed);
            
            p.canvas.pixelDensity(1);
            p.canvas.loadPixels();
            for(let i = 0; i<p.canvas.pixels.length ; ++i){
                p.canvas.pixels[i] = event.data.pixels[i];
            }
            p.canvas.updatePixels();
            console.log("Pixels Upadted");
            // console.log(canvas.pixels);
            // p.noLoop();
            console.log("Painting pixels");
            p.clear();
            p.image(p.canvas, 0, 0);
            console.log("Canvas dimensions : ",p.canvas.width, p.canvas.height);
            // p.loop();
        };
    };

    p.plotMandelBrotUtil = function(){
        if(!p.isMandelBrot){
            p.adjustCartesianBounds();

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
        
        let c_real_part;
        let c_complex_part;
        if(document.getElementById("const-j-cart").checked){
            c_real_part = parseFloat(document.getElementById('const-j-real').value);
            c_complex_part = parseFloat(document.getElementById('const-j-complex').value);
        }else{
            let r = parseFloat(document.getElementById('const-j-rad').value);
            let theta = Math.PI*parseFloat(document.getElementById('const-j-angle').value);
            c_real_part = r*Math.cos(theta);
            c_complex_part = r*Math.sin(theta);
        }

        let c = {
            real_part:c_real_part,
            complex_part: c_complex_part
        }
        const j = new JuliaPlot(
            arg_height,
            arg_width,
            parseInt(document.getElementById('iterations-j').value),
            parseInt(document.getElementById('upper-bound-j').value),
            cartesian_bounds,
            c
            );
        
        let worker = new Worker('JuliaWorker.js');
    
        console.log("parent , sending message, j.computed = " + j.computed);
        
        worker.postMessage(j);
        
        worker.onmessage = function(event){
            console.log("parent, message recieved, j.computed = " + event.data.computed);
            
            p.canvas.pixelDensity(1);
            p.canvas.loadPixels();
            for(let i = 0; i<p.canvas.pixels.length ; ++i){
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
        
        p.adjustCartesianBounds();

        p.setup();
    };

    p.zoomIn = function(x, y){
        let scale = 1/document.getElementById('scaling-factor').value;
        console.log("scaling by "+ scale, x, y);
        let range_x = scale*(p.cartesian_bounds.x_max - p.cartesian_bounds.x_min);
        let range_y = scale*(p.cartesian_bounds.y_max - p.cartesian_bounds.y_min) ;
        let x_ = p.map(x, 0, p.width, p.cartesian_bounds.x_min, p.cartesian_bounds.x_max);
        let y_ = p.map(y, 0, p.height, p.cartesian_bounds.y_max, p.cartesian_bounds.y_min);
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
        let scale = document.getElementById('scaling-factor').value;
        console.log("scaling by "+ scale);
        let range_x = scale*(p.cartesian_bounds.x_max - p.cartesian_bounds.x_min);
        let range_y = scale*(p.cartesian_bounds.y_max - p.cartesian_bounds.y_min);
        let x = (p.cartesian_bounds.x_min + p.cartesian_bounds.x_max)/2;
        let y = (p.cartesian_bounds.y_max + p.cartesian_bounds.y_min)/2;
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
            p.adjustCartesianBounds();
            p.plotMandelBrot(p.width, p.height, p.cartesian_bounds);
        }else{
            p.adjustCartesianBounds();
            p.plotJulia(p.width, p.height, p.cartesian_bounds);
        }
    
    };
        
}

let sketch = new p5(setMethods, 'sketch-container');

const sketch_container = document.getElementById("sketch-container");

window.onresize = function(){sketch.setup();}

document.getElementById("sketch-container").ondblclick = function(){sketch.zoomIn(sketch.mouseX, sketch.mouseY);}

document.getElementById("plot-mb").onclick = function(){sketch.plotMandelBrotUtil();}

document.getElementById("plot-j").onclick = function(){sketch.plotJuliaUtil();}

document.getElementById("zoom-in").onclick = function(){sketch.zoomIn(sketch.width/2, sketch.height/2)}

document.getElementById("zoom-out").onclick = function(){sketch.zoomOut()}

document.getElementById("reset").onclick = function(){sketch.resetScaling()}

// Tab Switch

let tabs = document.querySelectorAll(".tab");
let tab_contents = document.querySelectorAll(".tab-content");

function showTabContent(event){
    tabs.forEach(tab=>tab.classList.remove("active"));
    tab_contents.forEach(tab_content=>tab_content.classList.remove("show"));

    this.classList.add("active");
    console.log(`#${this.id}-content`);
    document.querySelector(`#${this.id}-content`).classList.add("show");
    document.querySelector("#common-tab-content").classList.add("show");
}


tabs.forEach(tab => tab.addEventListener('click', showTabContent))