class JuliaPlot{
    static pixel_density = 1;
        
    height;
    width;
    iterations;
    uppper_bound;
    pixels;
    
    cartesian_bounds;

    c;
    
    constructor(height, width, iterations, upper_bound, cartesian_bounds, c){
        this.height = height;
        this.width = width;

        this.cartesian_bounds = cartesian_bounds;
        
        this.c = c;

        this.upper_bound = upper_bound;
        this.iterations = iterations;

        this.pixels = new Uint8ClampedArray(height*width*4);
    }
}