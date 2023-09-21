import { Uniform } from 'three'
import { Effect, EffectAttribute } from 'postprocessing'

import {HorizontalBlurShader} from '../shaders/HorizontalBlurShader'

let _uStrength

export class HorizontalBlurEffect extends Effect {
  constructor({ strength = 0.1 } = {}) {
    super('HorizontalBlurEffect', HorizontalBlurShader.fragmentShader, {
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map([['strength', new Uniform(strength)]])
    })

    _uStrength = strength
  }

  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('strength').value = _uStrength
  }
}
