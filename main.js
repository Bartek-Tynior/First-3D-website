import * as three from 'three';
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap';

//Scene
const scene = new three.Scene();

//Create our sphere
const geometry = new three.SphereGeometry(3, 64, 64);
const material = new three.MeshStandardMaterial({
    color: '#00ff83',
    roughness: 0.5
});
const mesh = new three.Mesh(geometry, material);
scene.add(mesh);

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}



//Light
const light = new three.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10)
scene.add(light);


//Camera
const camera = new three.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20; 
scene.add(camera);


//Render
const canvas = document.querySelector('.webgl');
const renderer = new three.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);


//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;


//Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height);
})

const loop = () => {
    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()



const tl = gsap.timeline({
    defaults: {duration: 1}
});

tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"})

//Mouse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseUp', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150
        ]
        
        let newColor = new three.Color(`rgb(${rgb.join(",")})`);
        gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b});
    }
});