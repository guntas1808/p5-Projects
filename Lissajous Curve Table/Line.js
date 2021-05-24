class Line {
    constructor(circle ,isRow, isColumn){
        this.isRow = isRow;
        this.isColumn = isColumn;
        this.circle = circle;
    }
    
    show(p){
        p.strokeWeight(0.5);
        if(this.isRow){
            p.line(0, this.circle.pointY, p.width, this.circle.pointY);
        }
        if(this.isColumn){
            p.line(this.circle.pointX, 0, this.circle.pointX, p.height);
        }
    }
}