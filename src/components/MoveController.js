// src/components/MoveController.js
import * as THREE from 'three';

class MoveController {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
        this.speed = 0.1;
        this.keys = { w: false, a: false, s: false, d: false };
        this.mouse = { x: 0, y: 0 };

        this.initEventListeners();
    }

    initEventListeners() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        window.addEventListener('keyup', (event) => this.onKeyUp(event));
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
    }

    onKeyDown(event) {
        if (event.key in this.keys) {
            this.keys[event.key] = true;
        }
    }

    onKeyUp(event) {
        if (event.key in this.keys) {
            this.keys[event.key] = false;
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    update() {
        const direction = new THREE.Vector3();
        if (this.keys.w) direction.z -= this.speed;
        if (this.keys.s) direction.z += this.speed;
        if (this.keys.a) direction.x -= this.speed;
        if (this.keys.d) direction.x += this.speed;

        direction.applyQuaternion(this.camera.quaternion);
        this.camera.position.add(direction);
    }
}

export default MoveController;
