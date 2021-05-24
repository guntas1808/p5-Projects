class Circle{
    constructor(p,x, y, radius, baseAngularVal, k, n, parent=null){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = 0;
        this.n = n;
        this.angularVelocity = p.radians(baseAngularVal * Math.pow(k,n-1));
        this.parent = parent;
        this.child = null;
    }
    
    addChild(p,radius, baseAngularVal, k){
        this.child = new Circle(p,
                            this.x+(this.radius+radius)*Math.cos(this.angle),
                            this.y-(this.radius+radius)*Math.sin(this.angle),
                            radius,
                            baseAngularVal,
                            k,
                            this.n+1,
                            this
                        );
    }

    show(p){
        p.noFill();
        p.ellipse(this.x,this.y,this.radius*2,this.radius*2);
    }
    
    update(dt){
        if(this.parent!=null){
            // console.log("Parent ", this.parent);
            // console.log("Sine, Cosine ", Math.cos(this.parent.angle), Math.sin(this.parent.angle));
            this.x = this.parent.x+(this.parent.radius+this.radius)*Math.cos(this.parent.angle);
            this.y = this.parent.y-(this.parent.radius+this.radius)*Math.sin(this.parent.angle);
        }
        this.angle+=this.angularVelocity*(dt);
        return;
    }
}