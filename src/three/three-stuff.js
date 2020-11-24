import vertexShader from '../shaders/vertexShader.js';
import fragmentShader from '../shaders/fragmentShader.js';

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // time: 0,
};

export const Sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  //attach the canvas to the dom
  const container = context.canvas
  container.appendChild(renderer.domElement)

  // WebGL background color
  renderer.setClearColor(0xeeeeee, 1);
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerwidth/window.innerHeight,
    0.001,
    1000
  );

  camera.position.set(0, 0, 2);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  let time = 0;
  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  let material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable'
    },
    side:  THREE.DoubleSide,
    uniforms:{
      time: { type: "f", value: 0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  })

  let geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

  let plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  console.log("Sketch running")

  // draw each frame
  return {
    // Handle resize events here
    resize() {
      // renderer.setPixelRatio(pixelRatio);
      // renderer.setSize(viewportWidth, viewportHeight);
      // camera.aspect = viewportWidth / viewportHeight;

      let width = container.offsetWidth;
      let height =  container.offsetHeight;
      renderer.setSize(width, height);
      camera.aspect = width/ height;
      
      let imageAspect = 853/1280;
      let a1; 
      let a2;
      if(height/width > imageAspect) {
        a1 = (width/ height) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = (height/ width) / imageAspect;
      }

      material.uniforms.resolution.value.x = width;
      material.uniforms.resolution.value.y = height;
      material.uniforms.resolution.value.z = a1;
      material.uniforms.resolution.value.w = a2;
      
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render() {
      // time += 0.05;
      // material.uniforms.time.value = time;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(Sketch, settings);