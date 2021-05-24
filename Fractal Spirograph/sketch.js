let setMethods = function(p) {
    p.base;
    p.path =[];
    p.isComplete = false;
    p.displayConstructor = false;
    //spirograph parameters
    p.k;
    p.levels;
    p.radiusReduction;
    p.baseRadius;
    p.dt = 1/30;
    p.baseAngularVal;

    p.setup = function(){
        p.levels = parseInt(document.getElementById("levels").value);
        p.baseRadius = parseInt(document.getElementById("base-radius").value);
        p.radiusReduction = parseFloat(document.getElementById("radius-reduction").value);
        p.k = parseInt(document.getElementById("k").value);
        // p.dt = parseFloat(document.getElementById("time-per-frame").value);
        p.baseAngularVal = parseFloat(document.getElementById("base-angular-vel").value);

        p.div_width = document.getElementById('sketch-container').offsetWidth;
        p.div_height = document.getElementById('sketch-container').offsetHeight;
        
        // p.frameRate(30);

        p.createCanvas(p.div_width, p.div_height);
        p.base = new Circle(
                        p,
                        p.width/2,
                        p.height/2,
                        p.baseRadius,
                        p.baseAngularVal,
                        p.k,
                        1
                    );
        
        let next = p.base;
        for(let i=1;i<p.levels;++i){
            next.addChild(
                        p,
                        next.radius/p.radiusReduction,
                        p.baseAngularVal,
                        p.k
                    );
            next = next.child;
        }
    }


    p.draw = function(){
        p.displayConstructor = document.getElementById("display").checked;
        console.log(p.frameRate());
        
        p.div_width = document.getElementById('sketch-container').offsetWidth;
        p.div_height = document.getElementById('sketch-container').offsetHeight;
        
        p.resizeCanvas(p.div_width, p.div_height);
        p.background(0);
        p.fill(0);
        if(p.displayConstructor){
            p.stroke(255);
        }else{
            p.stroke(0);
        }
        if(p.base.angle> 2*Math.PI){
            p.isComplete=true; //the shape is complete when p.base angle reaches 2*pi
        }
        
        let next = p.base;
        for(let i=0;i<(p.levels);++i){
            if(!p.isComplete){
                next.update(p.dt);
            }
            next.show(p);
            if(next.child==null)break;
            next = next.child;            //    draw the circles
        }
        
        if(!p.isComplete){
            p.append(p.path,p.createVector(next.x,next.y))   //add point to vector list if shape incomplete
        }

        p.stroke(255,100,100);
        p.noFill();
        p.strokeWeight(2)
        
        p.beginShape();
        for(let i=0;i<p.path.length;++i){
            p.vertex(p.path[i].x,p.path[i].y);  //draw shape using the vector list
        }
        if(p.isComplete){
            p.vertex(p.path[0].x,p.path[0].y);
        }
        p.endShape();
    
    }

    p.reDraw = function(){
        p.background(0);
        p.path = [];
        p.base = null;
        p.isComplete = false;
        p.setup();
    }

}
let sketch = new p5(setMethods, 'sketch-container');

document.getElementById('draw').addEventListener('click', e => sketch.reDraw());

document.getElementById('display').addEventListener('change', e => sketch.displayConstructor = true);

window.addEventListener('resize', e => sketch.reDraw());