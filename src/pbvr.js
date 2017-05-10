import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import EnsembleAveragePass from './lib/three-ensemble-average-pass';
import _ from 'lodash';

const EffectComposer = require('three-effectcomposer')(THREE);

export default class PBVR {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.001, 10000);
    this.camera.position.set(0, 0, 200);
    this.controls = new OrbitControls(this.camera);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new EffectComposer.ShaderPass({
      vertexShader: require('./glsl/composer.vert'),
      fragmentShader: require('./glsl/composer.frag')
    }));

    this.animate = this.animate.bind(this);
    this.animate();

    this.resetDimensions();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.composer.render();
  }

  resetDimensions() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
  }

  drawParticles(data) {
    const ensemble = data.values.length;
    const geometries = _.range(ensemble).map(i => new THREE.BufferGeometry());
    const scenes = _.range(ensemble).map(i => new THREE.Scene());
    const material = new THREE.ShaderMaterial({
      vertexShader: require('./glsl/particle.vert'),
      fragmentShader: require('./glsl/particle.frag')
    });

    data.values.forEach((particles, idx) => {
      const positions = new Float32Array(particles.length * 3);
      const values = new Float32Array(particles.length);
      const rs = new Float32Array(particles.length);
      for (let i = 0; i < particles.length; i++) {
        positions[i * 3 + 0] = particles[i][0];
        positions[i * 3 + 1] = particles[i][1];
        positions[i * 3 + 2] = particles[i][2];
        values[i] = particles[i][3];
        rs[i] = particles[i][4];
      }
      geometries[idx].addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometries[idx].addAttribute('value', new THREE.BufferAttribute(values, 1));
      geometries[idx].addAttribute('r', new THREE.BufferAttribute(rs, 1));
      scenes[idx].add(new THREE.Points(geometries[idx], material));

      const effect = new EnsembleAveragePass(scenes[idx], this.camera, ensemble);
      if (idx === ensemble - 1) {
        effect.renderToScreen = true;
      }
      this.composer.addPass(effect);
    });
    this.adjustCameraPosition();
  }

  adjustCameraPosition() {
    this.controls.target = new THREE.Vector3(60, 60, 0);
  }

  get domElement() {
    return this.renderer.domElement;
  }
}
