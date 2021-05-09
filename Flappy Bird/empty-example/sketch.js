var flappy;
var height;
var width;
var pipes;
var pipepos;
function setup() {
    height = 700;
    width = 700;
    createCanvas(width,height);// put setup code here
    pipepos = 600;
    flappy = new Bird(width, height);
    pipes = new PipePair(600,300);
}

function draw() {
    background(0);
    
    
    if(flappy.intersects(pipes)){
        pipes.speed = 0;
        flappy.yspeed = 0;
        flappy.gravity = 0;   
    }else{
        pipes.progress();
    }
    pipes.show();
    if(flappy.y < (height - flappy.size/2)){
        flappy.fall();
    }
    flappy.show();  
    // put drawing code here
}

function keyPressed(){
    flappy.bounce();  
}

class Bird {
    constructor(width,height){
        this.x = width/10;
        this.y = height/2;
        this.yspeed = 0;
        this.gravity = 0.6;
        this.size = 50;
    }
    
    show(){
        fill(200);
        ellipse(this.x,this.y,this.size); 
    }
    
    fall(){
        if(this.y != height){
            this.yspeed += this.gravity;
            this.y += this.yspeed;
        }
    }
    
    bounce(){
        if(this.y < this.size/2){
            this.y = this.size/2;
            this.yspeed = 0;
        }else{
            this.yspeed = -15;
        }
    }
    intersects(pipes){
        if(this.x+this.size/2 < pipes.x || this.x-this.size/2 > (pipes.x+pipes.width)){
            
        }else{
            if((this.y+this.size/2)<pipes.y && (this.y-this.size/2)>(pipes.y-pipes.gap)){
                return false;
            }else{
                return true;
            }
        }
    }
}

class PipePair{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.gap = 100;
        this.width = 70;
    }
    
    show(){
        fill(0,200,0);
        rect(this.x, this.y, this.width, height-this.y);
        rect(this.x, 0, this.width, this.y-this.gap);
    }
    
    progress(){
        this.x -= this.speed;
    }
    
}