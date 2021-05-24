class Circle{
    constructor(x, y, radius, angularVel, phase, parent=null){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = phase;
        this.pointX = this.x + this.radius*Math.cos(this.angle);
        this.pointY = this.y + this.radius*Math.sin(this.angle);
        this.angularVel = angularVel;
        this.parent = parent;
    }
    
    show(p){
        p.strokeWeight(1);
        p.ellipse(this.x,this.y, this.radius*2, this.radius*2);
        p.strokeWeight(1);
        p.point(this.pointX,this.pointY);
    }
    
    update(dt){
        if(this.angle > Math.TWO_PI){
            this.angle -= Math.TWO_PI;
        }
        this.angle += this.angularVel * dt;
        
        if(this.parent != null){
            this.x = this.parent.pointX;
            this.y = this.parent.pointY;
        }
        
        this.pointX = this.x + this.radius*Math.cos(this.angle);
        this.pointY = this.y + this.radius*Math.sin(this.angle);
    }
    
    
}