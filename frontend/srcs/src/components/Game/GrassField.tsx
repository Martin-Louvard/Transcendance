import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from 'three'
import { grassVertex } from './shaders/grass.vert';
import { grassFrag } from './shaders/grass.frag';

export function GrassField(props) {
	let instances;
	let w ;
	let d ;
	let h ;

	let group: THREE.Group;
	let positions: number[] = [];
	let indexs: number[] = [];
	let uvs: number[] = [];
	let terrPosis: number[] = [];
	let angles: number[] = [];
	let grassGeo: THREE.InstancedBufferGeometry;
	let grassParticles: THREE.Mesh;
	let grassPlaneGeo: THREE.PlaneGeometry;
	let grassPlaneMat: THREE.MeshBasicMaterial;
	let grassPlane: THREE.Mesh;


	let grassShaderMaterial;
	const {scene, clock} = useThree();

	useLayoutEffect(() => {
		group = new THREE.Group();
		instances = 100000;
		w = props.height;
		d = props.width;
		h = 0;
		const grassMaskTex = new THREE.TextureLoader().load( '/grass.jpg' );
		const grassDiffTex = new THREE.TextureLoader().load( '/grass_diffuse.png' );
		
		
		let uniforms = {
			grassMaskTex: { value: grassMaskTex },
			grassDiffTex: { value: grassDiffTex },
			time: { type: 'float', value: 0 },
		};
		
		grassShaderMaterial = new THREE.RawShaderMaterial( {

			uniforms: uniforms,
			vertexShader: grassVertex,
			fragmentShader: grassFrag,
			
			side:THREE.DoubleSide,
	
		} );
	
		createParticles();
	
		grassPlaneGeo = new THREE.PlaneGeometry( w, d );
		console.log(grassParticles);
		grassPlaneMat = new THREE.MeshBasicMaterial( {color: 0x08731f, side: THREE.DoubleSide} );
		grassPlane = new THREE.Mesh( grassPlaneGeo, grassPlaneMat );
		group.add( grassPlane );
		group.position.set(props.position[0], props.position[1], props.position[2])
		grassPlane.rotation.x = Math.PI / 2;
	}, [])


    function createParticles() {

        positions.push( 0.2, -0.5, 0 );
        positions.push( -0.5, -0.5, 0 );
        positions.push( -0.5, 0.2, 0 );
        positions.push( 0.2, 0.2, 0 );

        indexs.push(0);
        indexs.push(1);
        indexs.push(2);
        indexs.push(2);
        indexs.push(3);
        indexs.push(0);

        uvs.push(1.0, 0.0);
        uvs.push(0.0, 0.0);
        uvs.push(0.0, 1.0);
        uvs.push(1.0, 1.0);

        for( let i = 0 ; i < instances ; i++ ){
            let posiX = Math.random() * w - w/2;
            let posiY = h;
            let posiZ = Math.random() * d - d/2;
            terrPosis.push( posiX, posiY, posiZ );
            let angle = Math.random()*360;
            angles.push( angle );

        }
        grassGeo = new THREE.InstancedBufferGeometry();
        grassGeo.instanceCount = instances;

        grassGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        grassGeo.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
        grassGeo.setIndex(new THREE.BufferAttribute(new Uint16Array( indexs ), 1));

        grassGeo.setAttribute( 'terrPosi', new THREE.InstancedBufferAttribute( new Float32Array( terrPosis ), 3 ) );
        grassGeo.setAttribute( 'angle', new THREE.InstancedBufferAttribute(  new Float32Array( angles ), 1 ).setUsage( THREE.DynamicDrawUsage ) );

		grassParticles = new THREE.Mesh( grassGeo, grassShaderMaterial );
        grassParticles.frustumCulled = false;
        group.add( grassParticles );
		scene.add(group);

		console.log(grassGeo);


    }

	

    function update( dt ){

        let t = dt;
		if (grassParticles)
			console.log(grassParticles);
        //grassParticles.material.uniforms.time.value = t;

    }

	//useFrame((state, delta) => {
	//	//console.log(delta);
	//	//update(delta);
		
	//})

	return (
		<></>
	)
}
