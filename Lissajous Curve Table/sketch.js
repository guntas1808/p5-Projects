
let setMethods = function(p){
    p.rows = [];
    p.columns = [];
    p.curves = [];
    p.isComplete = [];
    p.completed;
    p.timeInterval = 1;
    p.gap = 10;
    p.rowNum;
    p.colNum;
    p.radius;
    p.angularVelocity = 1;

    p.div_height;
    p.div_width;

    p.setup = function(){
        p.div_height = document.getElementById('sketch-container').offsetHeight;
        p.div_width = document.getElementById('sketch-container').offsetWidth;
        
        p.createCanvas(p.div_width,p.div_height);
        
        p.rowNum = parseInt(document.getElementById("rows").value);
        p.colNum = parseInt(document.getElementById("columns").value);
        p.radius = parseInt(document.getElementById("radius").value);
        
        for(let i=1;i<=p.rowNum;++i){
            let circle = new Circle(
                                p,
                                p.radius + p.gap,
                                (2*i + 1)*(p.radius + p.gap),
                                i,
                                p.radius,
                                p.angularVelocity,
                                true,
                                false
                            );
            p.append(p.rows, circle);
        }
        for(let i=1;i<=p.colNum;++i){
            let circle = new Circle(
                                p,
                                (2*i + 1)*(p.radius + p.gap),
                                p.radius + p.gap,
                                i,
                                p.radius,
                                p.angularVelocity,
                                false,
                                true
                            );
            p.append(p.columns, circle);
        }
        for(let i=0;i<p.rowNum;++i){
            p.append(p.curves, []);
            p.append(p.isComplete, []);
            for(let j=0;j<p.colNum;++j){
                p.append(p.curves[i], []);
                p.append(p.isComplete[i], false);
            }
        }
        p.completed = false;
        p.colorMode(p.HSB);
        console.log(p.curves);  
    }

    p.draw = function(){
        p.resizeCanvas(p.div_width,p.div_height);
        p.background(0);
        p.stroke(255);
        p.noFill();
        for(let i=0;i<p.rowNum;++i){
            p.rows[i].show(p);
            p.rows[i].showPoint(p);
            p.rows[i].update(p.timeInterval);
        }
        for(let i=0;i<p.colNum;++i){
            p.columns[i].show(p);
            p.columns[i].showPoint(p);
            p.columns[i].update(p.timeInterval);
        }
        
        
        for(let i=0; i<p.rowNum; ++i){
            for(let j=0; j<p.colNum; ++j){
                let rotations = p.lcm(p.rows[i].n, p.columns[j].n)/p.columns[j].n;
                
                if(!p.isComplete[i][j]){
                    if((p.rows[i].rotations)>=rotations){
                        p.isComplete[i][j] = true;
                        p.append(p.curves[i][j],p.curves[i][j][0]);
                        ++p.completed;
                    }    
                
                    p.append(p.curves[i][j], p.createVector(p.columns[j].pointX, p.rows[i].pointY))
                }
                
                p.stroke(255);
                p.strokeWeight(1);
                p.noFill();
                p.beginShape();
                    let hue = p.map(i*j, 0, (p.rowNum-1)*(p.colNum-1), 0, 255);
                    let bright = p.map(j, 0, p.colNum-1, 50, 255);
                    p.stroke(hue, bright,hue+100);
                    for(let k=0; k<p.curves[i][j].length;++k){
                        p.vertex(p.curves[i][j][k].x, p.curves[i][j][k].y)
                    }
                p.endShape();
            }
        }
        if(p.completed == p.rowNum*p.colNum){
            p.noLoop();
        }
    }

    p.reset = function(){
        p.rows = [];
        p.columns = [];
        p.curves = [];
        p.isComplete = [];
        p.setup();
        p.loop();
    }

    p.gcd = function(x, y){
        x = Math.abs(x);
        y = Math.abs(y);
        while(y) {
            let t = y;
            y = x % y;
            x = t;
        }
        return x;
    }


    p.lcm = function(x, y){
        return (!x || !y) ? 0 : Math.abs((x * y) / p.gcd(x, y));
    }
}

let sketch = new p5(setMethods, 'sketch-container');

document.getElementById('reset').addEventListener('click', e => sketch.reset());

document.getElementById('pause').addEventListener('click', e => sketch.noLoop());

document.getElementById('resume').addEventListener('click', e => sketch.loop());

window.addEventListener('resize', e => sketch.reset());