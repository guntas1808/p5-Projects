  function setMethods(p){
    p.trunkLength=innerHeight/3;
    p.lengthReductionFactor;
    p.angleVal;
    p.branches;
    p.levelLim;
    p.isUniform;

    p.setup = function() {
        var div = document.getElementById('sketchContainer');
        p.createCanvas(div.offsetWidth, div.offsetWidth-100);
    }

    p.draw = function() {
        var div = document.getElementById('sketchContainer');
        p.resizeCanvas(div.offsetWidth, div.offsetWidth-100);
        //fractal tree characteristics
        p.branches = parseInt(document.getElementById("branches").value); //default 4
        p.levelLim = parseInt(document.getElementById("levels").value)-1; //default 4
        p.lengthReductionFactor = parseFloat(document.getElementById("lengthFactor").value); //default 0.6
        p.isUniform = document.getElementById("isUniform").checked; //default true
        p.angleVal = parseFloat(document.getElementById("angle").value);
        
        p.background(255,200,54);
        p.stroke(0);
        p.strokeWeight(2);
        p.translate(innerWidth/2,innerHeight-100);
        p.rotate(Math.PI);
        p.line(0,0,0,p.trunkLength);
        p.translate(0,p.trunkLength);
        p.stroke(0);
        p.fractalTree();
    }

    p.uniformBranch = function(x,y,angle,length,level){
        if(level>p.levelLim){
            return
        }
        //p.translate to next node
        p.translate(x,y);
        p.rotate(Math.PI);
        //draw branches
        for(var i = 0;i<p.branches;i++){
            p.rotate(angle);
            p.line(0,0,0,length);
            p.uniformBranch(0,length,angle,length*p.lengthReductionFactor,level+1);
        }
        //go back to previous node if all the branches drawn
        p.rotate(angle+Math.PI);
        p.translate(0,-length/p.lengthReductionFactor);
    }


    p.nonUniformBranch = function(x,y,angle,length,level){
        if(level>p.levelLim){
            return
        }
        //p.translate to next node
        p.translate(x,y);
        if(p.branches%2==0){
            p.rotate((angle)/2);
            p.line(0,0,0,length);
            p.nonUniformBranch(0,length,angle,length*p.lengthReductionFactor,level+1);
            for(let i = 0;i<(p.branches/2-1);i++){
                p.rotate(angle);
                p.line(0,0,0,length);
                p.nonUniformBranch(0,length,angle,length*p.lengthReductionFactor,level+1);
            }
            p.rotate(-(angle*(p.branches/2-1)+angle/2))
            p.rotate((-angle)/2);
            p.line(0,0,0,length);
            p.nonUniformBranch(0,length,angle,length*p.lengthReductionFactor,level+1);
            for(let i = 0;i<(p.branches/2-1);i++){
                p.rotate(-angle);
                p.line(0,0,0,length);
                p.nonUniformBranch(0,length,angle,length*p.lengthReductionFactor,level+1);
            }
            p.rotate(angle*(p.branches/2-1)+angle/2)
            p.translate(0,-length/p.lengthReductionFactor);
        }else{
            p.line(0,0,0,length);
            p.nonUniformBranch(0,length,angle,length*p.lengthReductionFactor,level+1);
            for(let i = 0;i<(p.branches-1)/2;i++){
                p.rotate(angle);
                p.line(0,0,0,length);
                p.nonUniformBranch(0,length,angle,length*p.lengthReductionFactor,level+1);
            }
            p.rotate(-(angle*(p.branches-1)/2));
            for(let i = 0;i<(p.branches-1)/2;i++){
                p.rotate(-angle);
                p.line(0,0,0,length);
                p.nonUniformBranch(0,length,angle,length*p.lengthReductionFactor,level+1);
            }
            p.rotate(angle*(p.branches-1)/2);
            p.translate(0,-length/p.lengthReductionFactor);
        }
    }

    p.fractalTree = function(){
        if(p.isUniform){
            p.uniformBranch(0,0,(2*Math.PI)/(p.branches+1),p.trunkLength*p.lengthReductionFactor*0.9,0);
        }else{
            p.nonUniformBranch(0,0,p.angleVal,p.trunkLength*p.lengthReductionFactor*0.9,0);
        }
    }
}

var sketch = new p5(setMethods, "sketchContainer")