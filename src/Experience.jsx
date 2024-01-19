import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Physics, RigidBody, CylinderCollider, CuboidCollider, InstancedRigidBodies } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'



export default function Experience() {

    const cubeRef = useRef()
    const twisterRef = useRef()
    // const cubesRef = useRef()
    const cubesCount = 3
    const instances = useMemo(() => {
        const instances = []
        for (let i = 0; i < cubesCount; i++) {
            instances.push(
                {
                    key: 'instaceCube_' + i,
                    position: [-2 + i * 2, 0, 0],
                    rotation: [0, 0, 0]
                }
            )
        }
        return instances
    }, [])

    const [hitSound] = useState(() => {
        return new Audio('./hit.mp3')
    })

    // useEffect(() => {
    //     for (let i = 0; i < cubesCount; i++) {
    //         const matrix = new THREE.Matrix4()
    //         matrix.compose(
    //             new THREE.Vector3(-2 + i * 2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1, 1, 1)
    //         )
    //         cubesRef.current.setMatrixAt(i, matrix)
    //     }
    // }, [])

    const cubeJump = () => {
        console.log(cubeRef.current)
        cubeRef.current.applyImpulse({ x: 0, y: 5, z: .4 })
        cubeRef.current.applyTorqueImpulse({
            x: Math.random() - .5,
            y: Math.random() - .5,
            z: Math.random() - .5,
        })
    }

    const hamburguer = useGLTF('./hamburger.glb')

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const eulerRotation = new THREE.Euler(0, time * 4, 0)
        const quaternionRottaion = new THREE.Quaternion()

        quaternionRottaion.setFromEuler(eulerRotation)
        twisterRef.current.setNextKinematicRotation(quaternionRottaion)

        const angle = time * .7
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2
        twisterRef.current.setNextKinematicTranslation({ x: x, y: -.8, z: z })


    })

    const collisionEnter = () => {
        // hitSound.currentTime = 0
        // hitSound.volume = Math.random()
        // hitSound.play()
    }

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />

        <Physics gravity={[0, -2, 0]}>
            <RigidBody colliders="ball">
                <mesh castShadow position={[- 2, 2, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>

            </RigidBody>

            <RigidBody
                ref={cubeRef}
                onCollisionEnter={collisionEnter}
                // onCollisionExit={()=>{console.log('exit collision')}}
                // onSleep={()=>{console.log('Not moving')}}
                // onWake={()=>{console.log('Starting moving')}}
                position={[1.5, 2, 0]}>

                <mesh className="cursor" onClick={cubeJump} castShadow position={[0, 1, 0]}>
                    <boxGeometry></boxGeometry>
                    <meshStandardMaterial color="blue"></meshStandardMaterial>
                </mesh>
            </RigidBody>
            <RigidBody ref={twisterRef}
                type='kinematicPosition'
                mass={10} position={[0, 0, 0]}>

                <mesh className="cursor" castShadow position={[0, 0, 0]}>
                    <boxGeometry args={[4, .5, .5]}></boxGeometry>
                    <meshStandardMaterial color="red"></meshStandardMaterial>
                </mesh>
            </RigidBody>
            <RigidBody position={[0, 4, 3]}>
                <primitive object={hamburguer.scene} scale={.25}></primitive>
                <CylinderCollider args={[.5, 1.25]}></CylinderCollider>
            </RigidBody>

            <RigidBody type='fixed'>
                <CuboidCollider args={[5, 2, .5]} position={[0, 1, 5.5]} />
                <CuboidCollider args={[5, 2, .5]} position={[0, 1, -5.5]} />
                <CuboidCollider args={[.5, 2, 5]} position={[5.5, 1, 0]} />
                <CuboidCollider args={[.5, 2, 5]} position={[-5.5, 1, 0]} />
            </RigidBody>

            <RigidBody type='fixed'>
                <mesh receiveShadow position-y={- 1.25} >
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>
            <InstancedRigidBodies instances={instances}>
                <instancedMesh
                    castShadow
                    args={[null, null, cubesCount]}>
                    <boxGeometry></boxGeometry>
                    <meshStandardMaterial color="tomato"></meshStandardMaterial>
                </instancedMesh>
            </InstancedRigidBodies>
        </Physics>
    </>
}