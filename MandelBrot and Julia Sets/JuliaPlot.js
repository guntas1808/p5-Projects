class JuliaPlot{
    static pixel_density = 1;
        
    height;
    width;
    iterations;
    uppper_bound;
    pixels;
    
    x_max;
    x_min;
    y_max;
    y_min;

    c_real_part;
    c_complex_part;
    
    constructor(height, width, iterations, upper_bound, c_real_part, c_complex_part){
        this.height = height;
        this.width = width;

        this.x_max = 1.7;
        this.x_min = -1.7;
        this.y_max = 1.7;
        this.y_min = -1.7;

        this.c_real_part = c_real_part;
        this.c_complex_part = c_complex_part;

        this.upper_bound = upper_bound;
        this.iterations = iterations;

        this.pixels = new Uint8ClampedArray(height*width*4);
    }

    resize(height, width){
        this.height = height;
        this.width = width;

        this.plot();
    }

    rescale(x_max, x_min, y_max, y_min){
        this.x_max = x_max;
        this.x_min = x_min;
        this.y_max = y_max;
        this.y_min = y_min;

        return this.plot();
    }

    zoomIn(x_coord, y_coord, scale){
        var x_dist = (this.x_max - this.x_min)*(1/scale); 
        var x_mid = map(x_coord, 0, this.width, this.x_min, this.x_max);
        
        var y_dist = (this.y_max - this.y_min)*(1/scale); 
        var y_mid = map(y_coord, 0, this.height, this.y_min, this.y_max);
        
        return this.rescale(x_mid + x_dist, x_mid - x_dist, y_mid + y_dist, y_mid + y_dist);
    }

    compute(x, y){
        var real_part = x;
        var complex_part = y;
        var real_part_next;
        var complex_part_next;

        for(var i =1;i<=this.iterations;i++){
            real_part_next = (real_part*real_part - complex_part*complex_part) + this.c_real_part;
            complex_part_next = (2*real_part*complex_part) + this.c_complex_part;   //Z(n+1) = Z(n)*Z(n) + c
            
            real_part = real_part_next;
            complex_part = complex_part_next;
            
            if(sqrt(real_part_next*real_part_next + complex_part_next*complex_part_next) > this.upper_bound){
                break;
            }
        }
        
        return map(i, 1, this.iterations, 0, 255);
    }

    plot(){
        // this.iterations = parseInt(document.getElementById('iterationsJulia').value);
        // this.upper_bound = parseInt(document.getElementById('upperBoundJulia').value);
        
        // if(document.getElementById("cartesian").checked){
        //     cReal = parseFloat(document.getElementById('cReal').value);
        //     cComplex = parseFloat(document.getElementById('cComplex').value);
        // }else{
        //     var r = parseFloat(document.getElementById('cR').value);
        //     var theta = PI*parseFloat(document.getElementById('cTheta').value);
        //     cReal = r*cos(theta);
        //     cComplex = r*sin(theta);
        // }
        // //load pixel array
        // pixelDensity(1);
        // loadPixels();
        for(let x=0; x < this.width; x++){
            for(let y=0; y < this.height; y++){
                    var x_ = map(x, 0, this.width, this.x_min, this.x_max);
                    var y_ = map(y, 0, this.height, this.y_max, this.y_min);
                    var color_val = this.compute(x_,y_)

                    var pixel_index = (x + y*this.width)*4;
                    if(color_val>255){
                        this.pixels[pixel_index + 0] = 255;
                        this.pixels[pixel_index + 1] = 118;
                        this.pixels[pixel_index + 2] = 40;
                        this.pixels[pixel_index + 3] = 255;
                    }else{
                        this.pixels[pixel_index + 0] = color_val;
                        this.pixels[pixel_index + 1] = color_val;
                        this.pixels[pixel_index + 2] = color_val;
                        this.pixels[pixel_index + 3] = 255;
                    }
            }
        }
        // updatePixels();
        // isJulia = true;
        return this.pixels;
    }
}