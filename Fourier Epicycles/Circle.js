class Circle{
    constructor(x, y, radius, angularVel, phase, parent=null){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = phase;
        this.pointX = this.x + this.radius*cos(this.angle);
        this.pointY = this.y + this.radius*sin(this.angle);
        this.angularVel = angularVel;
        this.parent = parent;
    }
    
    show(){
        strokeWeight(1);
        ellipse(this.x,this.y, this.radius*2, this.radius*2);
        strokeWeight(1);
        point(this.pointX,this.pointY);
    }
    
    update(){
        if(this.angle > TWO_PI){
            this.angle -= TWO_PI;
        }
        this.angle += this.angularVel * dt;
        
        if(this.parent != null){
            this.x = this.parent.pointX;
            this.y = this.parent.pointY;
        }
        
        this.pointX = this.x + this.radius*cos(this.angle);
        this.pointY = this.y + this.radius*sin(this.angle);
    }
    
    
}