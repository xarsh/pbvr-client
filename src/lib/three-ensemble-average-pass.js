// mainly taken from likr/three-ensemble-average-pass
/*eslint semi: ["error", "never"]*/

const THREE = require('three')
const EffectComposer = require('three-effectcomposer')(THREE)

class EnsembleAveragePass {
  constructor (scene, camera, repeat) {
    this.scene = scene
    this.camera = camera
    this.uniforms = THREE.UniformsUtils.clone({
      accBuffer: {type: 't', value: null},
      newBuffer: {type: 't', value: null},
      scale: {type: 'f', value: 1 / repeat}
    })
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D accBuffer;
        uniform sampler2D newBuffer;
        uniform float scale;
        varying vec2 vUv;
        void main() {
          vec4 accColor = texture2D(accBuffer, vUv);
          vec4 newColor = texture2D(newBuffer, vUv) * scale;
          newColor.a = 1.0;
          gl_FragColor = accColor + newColor;
        }
      `
    })
    this.enabled = true
    this.needsSwap = true
  }

  render (renderer, writeBuffer, readBuffer) {
    if (!EnsembleAveragePass.sceneBuffer) {
      EnsembleAveragePass.sceneBuffer = readBuffer.clone() // XXX
    }
    renderer.render(this.scene, this.camera, EnsembleAveragePass.sceneBuffer, true)
    this.uniforms.accBuffer.value = readBuffer.texture
    this.uniforms.newBuffer.value = EnsembleAveragePass.sceneBuffer.texture
    EffectComposer.quad.material = this.material
    if (this.renderToScreen) {
      renderer.render(EffectComposer.scene, EffectComposer.camera)
    } else {
      renderer.render(EffectComposer.scene, EffectComposer.camera, writeBuffer, true)
    }
  }
}

module.exports = EnsembleAveragePass
