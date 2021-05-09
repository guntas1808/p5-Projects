var trunkLength=innerHeight/3;
var lengthReductionFactor;
var angleVal;
var branches;
var levelLim;
var isUniform;
function setup() {
    createCanvas(innerWidth,innerHeight-100);
}


function draw() {
    createCanvas(innerWidth,innerHeight-100);
    
    //fractal tree characteristics
    branches = parseInt(document.getElementById("branches").value); //default 4
    levelLim = parseInt(document.getElementById("levels").value)-1; //default 4
    lengthReductionFactor = parseFloat(document.getElementById("lengthFactor").value); //default 0.6
    isUniform = document.getElementById("isUniform").checked; //default true
    angleVal = parseFloat(document.getElementById("angle").value);;
    
//    if(frameCount%100==0){
//        console.log(branches);
//    }
    
    background(255,200,54);
    stroke(0);
    strokeWeight(2);
    translate(innerWidth/2,innerHeight-100);
    rotate(PI);
    line(0,0,0,trunkLength);
    translate(0,trunkLength);
    stroke(0);
    fractalTree();
}


function uniformBranch(x,y,angle,length,level){
    if(level>levelLim){
        return
    }
    //translate to next node
    translate(x,y);
    rotate(PI);
    //draw branches
    for(var i = 0;i<branches;i++){
        rotate(angle);
        line(0,0,0,length);
        uniformBranch(0,length,angle,length*lengthReductionFactor,level+1);
    }
    //go back to previous node if all the branches drawn
    rotate(angle+PI);
    translate(0,-length/lengthReductionFactor);
}


function nonUniformBranch(x,y,angle,length,level){
    if(level>levelLim){
        return
    }
    //translate to next node
    translate(x,y);
    if(branches%2==0){
        rotate((angle)/2);
        line(0,0,0,length);
        nonUniformBranch(0,length,angle,length*lengthReductionFactor,level+1);
        for(let i = 0;i<(branches/2-1);i++){
            rotate(angle);
            line(0,0,0,length);
            nonUniformBranch(0,length,angle,length*lengthReductionFactor,level+1);
        }
        rotate(-(angle*(branches/2-1)+angle/2))
        rotate((-angle)/2);
        line(0,0,0,length);
        nonUniformBranch(0,length,angle,length*lengthReductionFactor,level+1);
        for(let i = 0;i<(branches/2-1);i++){
            rotate(-angle);
            line(0,0,0,length);
            nonUniformBranch(0,length,angle,length*lengthReductionFactor,level+1);
        }
        rotate(angle*(branches/2-1)+angle/2)
        translate(0,-length/lengthReductionFactor);
    }else{
        line(0,0,0,length);
        nonUniformBranch(0,length,angle,length*lengthReductionFactor,level+1);
        for(let i = 0;i<(branches-1)/2;i++){
            rotate(angle);
            line(0,0,0,length);
            nonUniformBranch(0,length,angle,length*lengthReductionFactor,level+1);
        }
        rotate(-(angle*(branches-1)/2));
        for(let i = 0;i<(branches-1)/2;i++){
            rotate(-angle);
            line(0,0,0,length);
            nonUniformBranch(0,length,angle,length*lengthReductionFactor,level+1);
        }
        rotate(angle*(branches-1)/2);
        translate(0,-length/lengthReductionFactor);
    }
}

function fractalTree(){
    if(isUniform){
        uniformBranch(0,0,(2*PI)/(branches+1),trunkLength*lengthReductionFactor*0.9,0);
        return;
    }else{
        nonUniformBranch(0,0,angleVal,trunkLength*lengthReductionFactor*0.9,0);
        return;
    }
}