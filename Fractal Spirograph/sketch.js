var base;
var next;
var path =[];
var isComplete = false;
var displayConstructor = false;
//spirograph parameters
var k;
var levels;
var radiusReduction=3;
var baseRadius;
var dt;
function setup() {
    levels = parseInt(document.getElementById("levels").value);
    baseRadius = parseInt(document.getElementById("baseRadius").value);
    radiusReduction = parseFloat(document.getElementById("radiusRed").value);
    k = parseInt(document.getElementById("k").value);
    dt = parseFloat(document.getElementById("time").value);
    
    createCanvas(innerWidth, innerHeight);
    base = new Circle(innerWidth/2,innerHeight/2,baseRadius,1);
    
    next = base;
    for(var i=1;i<levels;++i){
        next.addChild(next.radius/radiusReduction);
        next = next.child;
    }
    
}


function draw() {
    displayConstructor = document.getElementById("display").checked;
    console.log(frameRate);
    createCanvas(innerWidth, innerHeight);
    background(0);
    fill(0);
    if(displayConstructor){
        stroke(255);
    }else{
        stroke(0);
    }
    if(base.angle> 2*PI){
        isComplete=true; //the shape is complete when base angle reaches 2*pi
    }
    
    next = base;
    for(var i=0;i<(levels+1);++i){
        if(!isComplete){
            next.update();
        }
        next.show();
        if(next.child==null)break;
        next = next.child;            //    draw the circles
    }
    
    if(!isComplete){
        append(path,createVector(next.x,next.y))   //add point to vector list if shape incomplete
    }

    stroke(255,100,100);
    noFill();
    strokeWeight(2)
    
    beginShape();
    for(var i=0;i<path.length;++i){
        vertex(path[i].x,path[i].y);  //draw shape using the vector list
    }
    if(isComplete){
        vertex(path[0].x,path[0].y);
    }
    endShape();
   
}

function reDraw(){
    background(0);
    path = [];
    base = null;
    isComplete = false;
    setup();
}

class Circle{
    constructor(x, y, radius, n, parent=null){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = 0;
        this.n = n;
        this.angularVelocity =  radians(pow(k,n-1));
        this.parent = parent;
        this.child = null;
    }
    
    addChild(radius){
        this.child = new Circle(this.x+(this.radius+radius)*cos(this.angle),this.y-(this.radius+radius)*sin(this.angle),radius, this.n+1,this)
    }
    
    show(){
        noFill();
        ellipse(this.x,this.y,this.radius*2,this.radius*2);
    }
    
    update(){
        if(this.parent!=null){
            this.x = this.parent.x+(this.parent.radius+this.radius)*cos(this.parent.angle);
            this.y = this.parent.y-(this.parent.radius+this.radius)*sin(this.parent.angle);
        }
        this.angle+=this.angularVelocity*dt;
        return;
    }
}