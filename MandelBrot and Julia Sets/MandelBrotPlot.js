class MandelBrotPlot{
    static pixel_density = 1;
        
    height;
    width;
    iterations;
    uppper_bound;
    pixels;

    computed = false;
    
    cartesian_bounds;

    constructor(height, width, iterations, upper_bound, cartesian_bounds){
        this.height = height;
        this.width = width;

        this.cartesian_bounds = cartesian_bounds;

        this.upper_bound = upper_bound;
        this.iterations = iterations;

        this.pixels = new Uint8ClampedArray(height*width*4);
    }
}