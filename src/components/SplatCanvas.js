import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { cameras, getViewMatrix, getProjectionMatrix } from '../components/main';

function SplatCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({ canvas: canvas });

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);

        camera.matrixAutoUpdate = false;
        const viewMatrix = new THREE.Matrix4().fromArray(getViewMatrix(cameras[0]).flat());
        const projectionMatrix = new THREE.Matrix4().fromArray(getProjectionMatrix(cameras[0].fx, cameras[0].fy, canvas.width, canvas.height).flat());
        camera.matrixWorldInverse.copy(viewMatrix);
        camera.projectionMatrix.copy(projectionMatrix);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        function animate() {
            requestAnimationFrame(animate);
            // 여기서 애니메이션 관련 업데이트 수행
            renderer.render(scene, camera);
        }

        animate();

        return () => {
            renderer.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} width="800" height="600"></canvas>;
}

export default SplatCanvas;
