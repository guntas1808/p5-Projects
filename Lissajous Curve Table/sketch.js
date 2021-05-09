var rows = [];
var columns = [];
var curves = [];
var isComplete = [];
var completed;
var timeInterval = 1;
var gap = 10;
var rowNum;
var colNum;
var radius;
var angularVel = 1;

function setup() {
    createCanvas(innerWidth,1200);
    
    rowNum = parseInt(document.getElementById("row").value);
    colNum = parseInt(document.getElementById("col").value);
    radius = parseInt(document.getElementById("radius").value);
    
    for(var i=1;i<=rowNum;++i){
        circle = new Circle(radius + gap, (2*i + 1)*(radius + gap),i,radius,angularVel,true,false);
        append(rows, circle);
    }
    for(var i=1;i<=colNum;++i){
        circle = new Circle((2*i + 1)*(radius + gap),radius + gap,i,radius,angularVel,false,true);
        append(columns, circle);
    }
    for(var i=0;i<rowNum;++i){
        append(curves, []);
        append(isComplete, []);
        for(var j=0;j<colNum;++j){
            append(curves[i], []);
            append(isComplete[i], false);
        }
    }
    completed = 0;
    colorMode(HSB);
    console.log(curves);
  // put setup code here
}

function draw() {
    createCanvas(innerWidth,1200);
    background(0);
    stroke(255);
    noFill();
    for(var i=0;i<rowNum;++i){
        rows[i].show();
        rows[i].showPoint();
        rows[i].update();
    }
    for(var i=0;i<colNum;++i){
        columns[i].show();
        columns[i].showPoint();
        columns[i].update();
    }
    
    
    for(var i=0; i<rowNum; ++i){
        for(var j=0; j<colNum; ++j){
            var rotations = lcm(rows[i].n, columns[j].n)/columns[j].n
            
            
            if(!isComplete[i][j]){
                if((rows[i].rotations)>=rotations){
                    isComplete[i][j] = true;
                    append(curves[i][j],curves[i][j][0]);
                    ++completed;
                }    
            
                append(curves[i][j], createVector(columns[j].pointX, rows[i].pointY))
            }
            
            stroke(255);
            strokeWeight(1);
            noFill();
            beginShape();
                hue = map(i*j, 0, (rowNum-1)*(colNum-1), 0, 255);
                bright = map(j, 0, colNum-1, 50, 255);
                stroke(hue, bright,hue+100);
                for(var k=0; k<curves[i][j].length;++k){
                    vertex(curves[i][j][k].x,curves[i][j][k].y)
                }
            endShape();
        }
    }
    if(completed == rowNum*colNum){
        noLoop();
//        console.log(frameRate());
    }
    console.log(frameRate());
}

function reset(){
    rows = [];
    columns = [];
    curves = [];
    isComplete = [];
    setup();
    loop();
}

function gcd(x, y){
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}


function lcm(x, y){
    return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

class Circle {
    constructor(x, y, n, radius, angularVel,isRow, isColumn){
        this.x = x;
        this.y = y;
        this.n = n;
        this.radius = radius;
        this.isRow = isRow;
        this.isColumn = isColumn;
        this.angle = 0;
        this.rotations = 0;
        this.angularVel = radians(angularVel)*n;
        this.line = new Line(this, this.isRow,this.isColumn);
    }
    
    update(){
        if(this.angle>2*PI){
            this.angle -= 2*PI;
            ++this.rotations;
        }
        this.angle += this.angularVel*timeInterval;
    }
    
    show(){
        strokeWeight(1);
        ellipse(this.x,this.y,this.radius*2, this.radius*2);
    }
    
    showPoint(){
        strokeWeight(5);
        this.pointX = this.x+this.radius*cos(this.angle);
        this.pointY = this.y+this.radius*sin(this.angle);
        point(this.pointX, this.pointY);
        
        this.line.show();
    }
}

class Line {
    constructor(circle ,isRow, isColumn){
        this.isRow = isRow;
        this.isColumn = isColumn;
        this.circle = circle;
    }
    
    show(){
        strokeWeight(0.5);
        if(this.isRow){
            line(0, this.circle.pointY, width, this.circle.pointY);
        }
        if(this.isColumn){
            line(this.circle.pointX, 0, this.circle.pointX, height);
        }
    }
}