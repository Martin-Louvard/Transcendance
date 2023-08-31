/**
 * https://www.airtightinteractive.com/demos/js/shaders/js/shaders/HorizontalBlurShader.js
 */

const HorizontalBlurShader = {
	fragmentShader: `
		  uniform float strength;
  
		  void main(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  
			  vec4 sum = vec4(0.0);
  
			  sum += texture2D(inputBuffer, vec2(uv.x - 4.0 * strength, uv.y)) * 0.051;
			  sum += texture2D(inputBuffer, vec2(uv.x - 3.0 * strength, uv.y)) * 0.0918;
			  sum += texture2D(inputBuffer, vec2(uv.x - 2.0 * strength, uv.y)) * 0.12245;
			  sum += texture2D(inputBuffer, vec2(uv.x - 1.0 * strength, uv.y)) * 0.1531;
			  sum += texture2D(inputBuffer, vec2(uv.x, uv.y)) * 0.1633;
			  sum += texture2D(inputBuffer, vec2(uv.x + 1.0 * strength, uv.y)) * 0.1531;
			  sum += texture2D(inputBuffer, vec2(uv.x + 2.0 * strength, uv.y)) * 0.12245;
			  sum += texture2D(inputBuffer, vec2(uv.x + 3.0 * strength, uv.y)) * 0.0918;
			  sum += texture2D(inputBuffer, vec2(uv.x + 4.0 * strength, uv.y)) * 0.051;
  
			  outputColor = sum;
  
		  }`
  }
  
  export {HorizontalBlurShader}
  