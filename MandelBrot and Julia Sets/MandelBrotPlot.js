class MandelBrotPlot{
    static pixel_density = 1;
        
    height;
    width;
    iterations;
    uppper_bound;
    pixels;

    computed = false;
    
    x_max;
    x_min;
    y_max;
    y_min;

    constructor(height, width, iterations, upper_bound, cartesian_bounds){
        this.height = height;
        this.width = width;

        this.x_min = cartesian_bounds.x_min;
        this.x_max = cartesian_bounds.x_max;
        this.y_max = cartesian_bounds.y_max;
        this.y_min = cartesian_bounds.y_min;
        

        this.upper_bound = upper_bound;
        this.iterations = iterations;

        this.pixels = new Uint8ClampedArray(height*width*4);
    }

    getPixels(){
        return this.pixels;
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

    compute(c_real_part, c_complex_part){
        var real_part = 0;
        var complex_part = 0;
        var real_part_next;
        var complex_part_next;
        var i;
        for(i =1;i<=this.iterations;i++){
            real_part_next = (real_part*real_part - complex_part*complex_part) + c_real_part;
            complex_part_next = (2*real_part*complex_part) + c_complex_part;   //Z(n+1) = Z(n)*Z(n) + c
            
            real_part = real_part_next;
            complex_part = complex_part_next;
            
            if(sqrt(real_part_next*real_part_next + complex_part_next*complex_part_next) > this.upper_bound){
                break;
            }
        }
        
        return map(i,1,this.iterations,0,255);
    }
    
    plot(){
        
        for(var x=0; x < this.width; x++){
            for(var y=0; y < this.height; y++){
                var x_ = map(x, 0, this.width, this.x_min, this.x_max);
                var y_ = map(y, 0, this.height, this.y_max, this.y_min);
                
                var color_val = this.compute(x_, y_);
                var pixel_index = (x + y * this.width)*4;

                if(color_val>=255){
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
        this.computed = true;
        return this.pixels;
    }
}