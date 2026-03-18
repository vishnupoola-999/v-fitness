// Three.js Scene Setup for V-Shape Fitness Arena
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class GymScene {
    constructor() {
        this.container = document.getElementById('canvas-container');
        if (!this.container) return;
        
        this.init();
        this.createLights();
        this.createEnvironment();
        this.createGymEquipment();
        this.createParticles();
        this.animate();
        this.bindEvents();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0f1014, 0.03);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 2, 8);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Limit looking below ground
        
        // Target offset so the main subject is slightly to the right
        this.controls.target.set(2, 1, 0);

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Vector2();
    }

    createLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Main Spotlight (Dramatic Gym Lighting)
        const spotLight = new THREE.SpotLight(0xffffff, 50);
        spotLight.position.set(0, 10, 5);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        // Neon Blue Rim Light
        const blueLight = new THREE.PointLight(0x00f3ff, 20, 10);
        blueLight.position.set(-3, 2, -2);
        this.scene.add(blueLight);

        // Warm Orange Fill Light
        const orangeLight = new THREE.PointLight(0xff6b00, 15, 10);
        orangeLight.position.set(3, 1, 3);
        this.scene.add(orangeLight);
    }

    createEnvironment() {
        // Simple Grid Floor
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            roughness: 0.1,
            metalness: 0.8
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        this.scene.add(plane);

        const gridHelper = new THREE.GridHelper(20, 20, 0x00f3ff, 0x333333);
        gridHelper.position.y = 0.01;
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    createGymEquipment() {
        // Since we can't reliably load GLTFs without a server/assets,
        // we will create stylized geometric representations of gym equipment
        this.equipmentGroup = new THREE.Group();
        this.equipmentGroup.position.set(2, 0, 0); // Offset to the right
        
        // Dumbbell representation
        const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
        const weightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15);
        const matBlack = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 });
        const matChrome = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });

        const dumbbell = new THREE.Group();
        
        const rod = new THREE.Mesh(rodGeo, matChrome);
        rod.rotation.z = Math.PI / 2;
        rod.castShadow = true;
        
        const w1 = new THREE.Mesh(weightGeo, matBlack);
        w1.position.x = 0.2;
        w1.rotation.z = Math.PI / 2;
        w1.castShadow = true;

        const w2 = new THREE.Mesh(weightGeo, matBlack);
        w2.position.x = -0.2;
        w2.rotation.z = Math.PI / 2;
        w2.castShadow = true;

        dumbbell.add(rod, w1, w2);
        dumbbell.position.set(0, 0.2, 2);
        
        // Stylized Abstract Human Figure (Coach Samee silhouette representation)
        const bodyGeo = new THREE.CapsuleGeometry(0.4, 1.2, 4, 16);
        const bodyMat = new THREE.MeshPhysicalMaterial({ 
            color: 0x00f3ff,
            transmission: 0.5,
            opacity: 0.8,
            transparent: true,
            roughness: 0.2,
            emissive: 0x00f3ff,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(0, 1, 0);
        body.castShadow = true;

        this.equipmentGroup.add(dumbbell, body);
        this.scene.add(this.equipmentGroup);
    }

    createParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0x00f3ff);
        const color2 = new THREE.Color(0xccff00);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = Math.random() * 5;
            positions[i + 2] = (Math.random() - 0.5) * 10;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i] = mixedColor.r;
            colors[i+1] = mixedColor.g;
            colors[i+2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    bindEvents() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Target rotation for subtle parallax
        this.targetRotation.x = this.mouse.y * 0.2;
        this.targetRotation.y = this.mouse.x * 0.2;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Slow auto-rotation of equipment
        if (this.equipmentGroup) {
            this.equipmentGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.5;
            // Hover effect
            this.equipmentGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
        }

        // Particle animation
        if (this.particles) {
            this.particles.rotation.y += delta * 0.05;
            const positions = this.particles.geometry.attributes.position.array;
            for(let i = 1; i < positions.length; i+=3) {
                positions[i] += Math.sin(elapsedTime + positions[i-1]) * 0.005;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Parallax effect on camera
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 2 + 2 - this.camera.position.y) * 0.05;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GymScene();
});
