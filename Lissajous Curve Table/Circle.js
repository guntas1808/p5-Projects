class Circle {
    constructor(p, x, y, n, radius, angularVelocity,isRow, isColumn){
        this.x = x;
        this.y = y;
        this.n = n;
        this.radius = radius;
        this.isRow = isRow;
        this.isColumn = isColumn;
        this.angle = 0;
        this.rotations = 0;
        this.angularVelocity = p.radians(angularVelocity)*n;
        this.line = new Line(this, this.isRow,this.isColumn);
    }
    
    update(timeInterval){
        if(this.angle>2 * Math.PI){
            this.angle -= 2 * Math.PI;
            ++this.rotations;
        }
        this.angle += this.angularVelocity*timeInterval;
    }
    
    show(p){
        p.strokeWeight(1);
        p.ellipse(this.x,this.y,this.radius*2, this.radius*2);
    }
    
    showPoint(p){
        p.strokeWeight(5);
        this.pointX = this.x+this.radius * Math.cos(this.angle);
        this.pointY = this.y+this.radius * Math.sin(this.angle);
        p.point(this.pointX, this.pointY);
        
        this.line.show(p);
    }
}