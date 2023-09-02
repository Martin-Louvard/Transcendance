import * as THREE from 'three';
import { grassVertex } from './shaders/grass.vert';
import { grassFrag } from './shaders/grass.frag';

function GrassShaderMaterial(  ){

	console.log("SALUT");
    const grassMaskTex = new THREE.TextureLoader().load( '/grass.jpg' );
    const grassDiffTex = new THREE.TextureLoader().load( '/grass_diffuse.jpg' );
    //console.log( grassTex );
    
    
    const uniforms = {
        grassMaskTex: { value: grassMaskTex },
        grassDiffTex: { value: grassDiffTex },
        time: { type: 'float', value: 0 },
    };


    

    //console.log( Basic_VS )
    //console.log( Basic_FS )

    const basicShaderMaterial = new THREE.RawShaderMaterial( {

        uniforms: uniforms,
        vertexShader: grassVertex,
        fragmentShader: grassFrag,
        
        // blending: THREE.AdditiveBlending,
        side:THREE.DoubleSide,
        // depthTest : false,
        // depthWrite : false,
        // transparent: true,
        // vertexColors: true

    } );
    return basicShaderMaterial;
}

export { GrassShaderMaterial };