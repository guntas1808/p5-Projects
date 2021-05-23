function map(value, original_min, original_max, new_min, new_max){
    var scale = (new_max-new_min)/(original_max-original_min);
    return new_min + scale*(value-original_min);
}

function compute(c_real_part, c_complex_part, iterations, upper_bound){
    var real_part = 0;
    var complex_part = 0;
    var real_part_next;
    var complex_part_next;
    
    for(var i =1;i<=iterations;i++){
        real_part_next = (real_part*real_part - complex_part*complex_part) + c_real_part;
        complex_part_next = (2*real_part*complex_part) + c_complex_part;   //Z(n+1) = Z(n)*Z(n) + c
        
        real_part = real_part_next;
        complex_part = complex_part_next;
        
        if(Math.sqrt(real_part_next*real_part_next + complex_part_next*complex_part_next) > upper_bound){
            break;
        }
    }
    
    return map(i,1,iterations,0,255);
}


function plot(pixels, arg_width, arg_height, cartesian_bounds, iterations, upper_bound){
    console.log(cartesian_bounds, pixels.length, arg_height, arg_width);
                
    for(var x=0; x < arg_width; x++){
        for(var y=0; y < arg_height; y++){
            var x_ = map(x, 0, arg_width, cartesian_bounds.x_min, cartesian_bounds.x_max);
            var y_ = map(y, 0, arg_height, cartesian_bounds.y_max, cartesian_bounds.y_min);
            
            var color_val = compute(x_, y_, iterations, upper_bound);
            var pixel_index = (x + y * arg_width)*4;
            
            if(color_val>=255){
                pixels[pixel_index + 0] = 255;
                pixels[pixel_index + 1] = 118;
                pixels[pixel_index + 2] = 40;
                pixels[pixel_index + 3] = 255;
            }else{
                pixels[pixel_index + 0] = color_val;
                pixels[pixel_index + 1] = color_val;
                pixels[pixel_index + 2] = color_val;
                pixels[pixel_index + 3] = 255;
            }
        }
    }
    return pixels;
}


self.onmessage = function(event){
    console.log("worker, message recieved, mb.computed = " + event.data.computed);
    
    var mb = event.data;

    mb.pixels = plot(mb.pixels, mb.width, mb.height, mb.cartesian_bounds, mb.iterations, mb.upper_bound);
    // event.data.plot()
    mb.computed = true;
    console.log("worker, computation done, sending message, mb.computed = " + event.data.computed);
    postMessage(mb);
}