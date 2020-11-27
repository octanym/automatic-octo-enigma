import './style.scss';
import Sketch from './three/three-class-refactor.js';

const canvasSketch = require('canvas-sketch');

let sketch = new Sketch({
  dom: document.getElementById('canvas')
})

let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrapper');
let elems = [...document.querySelectorAll('.n')];

window.addEventListener('wheel', e => {
  //slow down rate of change for y
  speed += e.deltaY*0.0003;
})

//create an array of object to iterate over
let objets = Array(5).fill({dist:0}) 

function raf(){
  position += speed;
  speed *= 0.8;
  rounded = Math.round(position);
  
  //iterate over the dist objects in the array we created
  objets.forEach((obj, index) => {
    obj.dist = Math.min(Math.abs(position - index), 1)
    obj.dist = 1 - obj.dist**2;
    elems[index].style.transform = `scale(${1 + 0.4*obj.dist})`
  })
  
  //acts as a lerp function
  let diff = (rounded - position);
  
  position += Math.sign(diff*0.050)*Math.pow(Math.abs(diff),0.7)*0.015;
  
  // console.log(position)
  // block.style.transform = `translate(0, ${position*100}px)`
  wrap.style.transform = `translate(0, ${-position*100 + 50}px)`
  
  sketch.meshes.forEach((mesh, i) => {
    mesh.position.y = i*1.2 + position*1.2
  })

  window.requestAnimationFrame(raf)
}

raf();

// canvasSketch(Sketch, settings);