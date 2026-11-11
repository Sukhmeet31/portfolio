import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Group, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from "three";
import { WORLD } from "@/lib/workshop-world";
import { stuntHeight } from "@/lib/coastal-games";
import type { Position } from "@/lib/movement";
import { Block, Disc } from "./objects";

export type Wave = Position & { id: number };
export const islandTrees: readonly Position[] = [
  { x: -21, z: -10 }, { x: -22, z: -4 }, { x: -20, z: 3 },
  { x: -7, z: -17 }, { x: -3, z: -19 }, { x: 4, z: -16 }, { x: 8, z: -19 },
  { x: -7, z: 18 }, { x: 0, z: 20 }, { x: 6, z: 17 },
  { x: 28, z: -19 }, { x: 29, z: -10 }, { x: 28, z: 6 },
];

function Ocean({ night, reducedMotion, visible, onWave, wave }: {
  night: boolean; reducedMotion: boolean; visible: boolean;
  onWave: (point: Position) => void; wave: Wave;
}) {
  const geometry = useRef<PlaneGeometry>(null);
  const ripples = useRef<Group>(null);
  const time = useRef(0);
  const waveTime = useRef(3);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(invalidate, 50);
    return () => window.clearInterval(timer);
  }, [visible, reducedMotion, invalidate]);
  useEffect(() => {
    if (wave.id) { waveTime.current = 0; invalidate(); }
  }, [wave.id, invalidate]);
  useFrame((_, delta) => {
    if (!visible) return;
    time.current += Math.min(delta, 0.05);
    const positions = geometry.current?.attributes.position;
    if (positions && !reducedMotion) {
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i), z = positions.getY(i);
        positions.setZ(i, Math.sin(x * 0.25 + time.current * 0.7) * 0.14 + Math.cos(z * 0.4 + time.current) * 0.08);
      }
      positions.needsUpdate = true;
    }
    if (ripples.current && waveTime.current < 3 && wave.id) {
      waveTime.current += Math.min(delta, 0.05);
      const t = reducedMotion ? 0.42 : Math.min(waveTime.current / 3, 1);
      ripples.current.children.forEach((child, i) => {
        const ring = child as Mesh;
        ring.scale.setScalar(1 + t * (6 + i * 2));
        (ring.material as MeshBasicMaterial).opacity = (1 - t) * 0.55;
      });
      if (!reducedMotion && t < 1) invalidate();
    }
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        if (event.delta < 5 && (Math.abs(event.point.x) > WORLD.width / 2 + 1.2 || Math.abs(event.point.z) > WORLD.depth / 2 + 1.2)) onWave({ x: event.point.x, z: event.point.z });
      }}>
        <planeGeometry ref={geometry} args={[600, 600, 100, 100]} />
        <meshStandardMaterial color={night ? "#12364f" : "#4ba3b6"} roughness={0.32} metalness={0.22} flatShading />
      </mesh>
      {Array.from({ length: 26 }, (_, i) => {
        const x = -43 + (i % 7) * 14, z = i < 14 ? -33 - Math.floor(i / 7) * 9 : 31 + Math.floor((i - 14) / 7) * 10;
        return <Block key={i} position={[x, -0.38, z]} size={[2 + i % 3, 0.012, 0.09]} color={night ? "#28516a" : "#b3e1dd"} castShadow={false} />;
      })}
      <group ref={ripples} position={[wave.x, -0.34, wave.z]} rotation={[-Math.PI / 2, 0, 0]}>
        {[0, 1, 2].map((i) => <mesh key={i}>
          <ringGeometry args={[0.95 + i * 0.2, 1 + i * 0.2, 48]} />
          <meshBasicMaterial color={night ? "#9bcaff" : "#e9ffed"} transparent opacity={0} depthWrite={false} />
        </mesh>)}
      </group>
    </group>
  );
}

function Lighthouse({ night }: { night: boolean }) {
  const target = useMemo(() => { const object = new Object3D(); object.position.set(38, -0.3, 24); return object; }, []);
  return <group>
    <group position={[28, 0, 19]}>
      <Disc position={[0, 0.2, 0]} radius={2.1} height={0.4} color="#b7bda8" />
      <mesh position={[0, 2.8, 0]} castShadow><cylinderGeometry args={[0.65, 1, 5.3, 16]} /><meshStandardMaterial color="#ece9d7" /></mesh>
      {[1.7, 3.6].map((y) => <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.86 - y * 0.04, 0.9 - y * 0.04, 0.65, 16]} /><meshStandardMaterial color="#4355f9" /></mesh>)}
      <Disc position={[0, 5.5, 0]} radius={1.1} height={0.18} color="#273447" />
      <mesh position={[0, 6.1, 0]}><cylinderGeometry args={[0.65, 0.65, 0.9, 12]} /><meshStandardMaterial color="#ffe6a6" emissive="#ffd38a" emissiveIntensity={night ? 3 : 0.2} /></mesh>
      <mesh position={[0, 6.9, 0]} castShadow><coneGeometry args={[1, 0.9, 16]} /><meshStandardMaterial color="#4355f9" /></mesh>
    </group>
    {night && <>
      <primitive object={target} />
      <spotLight position={[28, 6.1, 19]} target={target} color="#ffdf9e" intensity={90} distance={50} angle={0.45} penumbra={0.7} />
      <mesh position={[36, 6.1, 19]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[3.8, 16, 24, 1, true]} /><meshBasicMaterial color="#ffe3a9" transparent opacity={0.07} depthWrite={false} /></mesh>
    </>}
  </group>;
}

function NightSky() {
  const stars = useMemo(() => new Float32Array(Array.from({ length: 90 }, (_, i) => [Math.sin(i * 127.1) * 75, 20 + (i % 11) * 3, Math.cos(i * 53.7) * 70]).flat()), []);
  return <group>
    <mesh position={[-22, 11, -31]}><sphereGeometry args={[2.2, 24, 16]} /><meshBasicMaterial color="#fff2cf" /></mesh>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[stars, 3]} /></bufferGeometry><pointsMaterial color="#cfdeff" size={0.19} sizeAttenuation /></points>
  </group>;
}

export function CoastalWorld(props: { night: boolean; reducedMotion: boolean; visible: boolean; onWave: (point: Position) => void; wave: Wave }) {
  const { night } = props;
  const ramp = useMemo(() => {
    const vertices: number[] = [];
    for (let i = 0; i < 20; i++) {
      const z0 = 12 + i * 0.3, z1 = z0 + 0.3;
      const a = [16.2, stuntHeight({ x: 18, z: z0 }) + 0.02, z0], b = [19.8, a[1], z0];
      const c = [16.2, stuntHeight({ x: 18, z: z1 }) + 0.02, z1], d = [19.8, c[1], z1];
      vertices.push(...a, ...c, ...b, ...b, ...c, ...d);
    }
    return new Float32Array(vertices);
  }, []);
  return <group>
    <Ocean {...props} />
    <Block position={[0, -0.47, 0]} size={[WORLD.width + 2.4, 0.45, WORLD.depth + 2.4]} color={night ? "#7c8171" : "#d9cca7"} />
    <Block position={[0, -0.25, 0]} size={[WORLD.width, 0.5, WORLD.depth]} color={night ? "#526854" : "#aebd91"} />
    {/* Promenades connect all districts without forcing a long trip on foot. */}
    <Block position={[0, 0.015, 0]} size={[50, 0.025, 3.5]} color="#d3d6c2" castShadow={false} />
    <Block position={[10.6, 0.017, 6]} size={[3, 0.025, 36]} color="#d3d6c2" castShadow={false} />
    <Block position={[5, 0.019, 21]} size={[48, 0.025, 3]} color="#d3d6c2" castShadow={false} />
    {/* West circuit: a rectangular ring, matching the race boundary math. */}
    <Block position={[-21, 0.045, -2]} size={[18, 0.06, 36]} color={night ? "#1a2437" : "#394953"} castShadow={false} />
    <Block position={[-21, 0.085, -2]} size={[8, 0.045, 26]} color={night ? "#425b4a" : "#92ab81"} castShadow={false} />
    {[-30, -12, -25, -17].map((x) => <mesh key={x} position={[x, 0.1, -2]}><boxGeometry args={[0.1, 0.04, x === -30 || x === -12 ? 36 : 26]} /><meshStandardMaterial color="#9ba8ff" emissive="#6475ff" emissiveIntensity={night ? 2 : 0.1} /></mesh>)}
    {[-20, 16, -15, 11].map((z) => <mesh key={z} position={[-21, 0.1, z]}><boxGeometry args={[z === -20 || z === 16 ? 18 : 8, 0.04, 0.1]} /><meshStandardMaterial color="#9ba8ff" emissive="#6475ff" emissiveIntensity={night ? 2 : 0.1} /></mesh>)}
    {[-27.5, -14.5].flatMap((x) => Array.from({ length: 13 }, (_, i) => <Block key={`${x}-${i}`} position={[x, 0.09, -17 + i * 2.5]} size={[0.07, 0.01, 1.15]} color="#c6d3d9" castShadow={false} />))}
    {Array.from({ length: 16 }, (_, i) => <Block key={`flag-${i}`} position={[-21.5 + (i % 2) * 0.5, 0.095, 11.2 + Math.floor(i / 2) * 0.5]} size={[0.5, 0.02, 0.5]} color={(i + Math.floor(i / 2)) % 2 ? "#eaeade" : "#162733"} castShadow={false} />)}
    {[11, 15.5].map((z) => <Block key={z} position={[-21, 1.6, z]} size={[0.14, 3.2, 0.14]} color="#d6dce7" />)}
    <Block position={[-21, 3.3, 13.25]} size={[0.2, 0.55, 4.9]} color="#4355f9" />
    {/* East lane and its contrasting gutters. */}
    <Block position={[21, 0.045, -4.5]} size={[8, 0.08, 19]} color="#bac2b2" castShadow={false} />
    <Block position={[21, 0.095, -4.5]} size={[6.7, 0.045, 19]} color="#d8b779" castShadow={false} />
    {[17.45, 24.55].map((x) => <Block key={x} position={[x, 0.12, -4.5]} size={[0.45, 0.08, 19]} color="#58677a" castShadow={false} />)}
    {Array.from({ length: 7 }, (_, i) => <Block key={i} position={[18 + i, 0.125, -4.5]} size={[0.022, 0.01, 18.8]} color="#bd995f" castShadow={false} />)}
    <Block position={[21, 0.13, 1]} size={[6.7, 0.02, 0.18]} color="#4355f9" castShadow={false} />
    <Block position={[21, 1.8, -14]} size={[8, 3.6, 0.3]} color="#4355f9" />
    {[18.5, 21, 23.5].map((x) => <mesh key={x} position={[x, 2.1, -13.8]}><torusGeometry args={[0.55, 0.055, 8, 24]} /><meshStandardMaterial color="#e1e6ff" emissive="#a0bcff" emissiveIntensity={night ? 2 : 0.2} /></mesh>)}
    {/* A curved suspension ramp and a coastal boardwalk. */}
    <Block position={[18, 0.025, 15]} size={[7, 0.04, 14]} color="#b8bca2" castShadow={false} />
    <mesh castShadow receiveShadow><bufferGeometry onUpdate={(geometry) => geometry.computeVertexNormals()}><bufferAttribute attach="attributes-position" args={[ramp, 3]} /></bufferGeometry><meshStandardMaterial color="#f2b755" /></mesh>
    {[11, 19].flatMap((z) => [0, 1, 2].map((i) => <Block key={`${z}-${i}`} position={[18, 0.065, z + i * 0.25]} size={[3.6, 0.02, 0.12]} color="#4355f9" castShadow={false} />))}
    <Block position={[22, 0.04, 22.2]} size={[9, 0.07, 5]} color="#ae8e6b" castShadow={false} />
    {Array.from({ length: 10 }, (_, i) => <Block key={i} position={[22, 0.085, 20 + i * 0.45]} size={[8.9, 0.015, 0.035]} color="#876f57" castShadow={false} />)}
    {islandTrees.map((point, i) => <group key={i} position={[point.x, 0, point.z]}>
      <Block position={[0, 0.7, 0]} size={[0.2, 1.4, 0.2]} color="#7b7961" />
      <mesh position={[0, 2.1, 0]} castShadow><icosahedronGeometry args={[1.3 + i % 3 * 0.2, 0]} /><meshStandardMaterial color={i % 2 ? "#758d68" : "#8ea87a"} roughness={1} /></mesh>
    </group>)}
    {[-8, 8, 15, 28].flatMap((x) => [-21, 21].map((z) => <group key={`${x}-${z}`} position={[x, 0, z]}>
      <Block position={[0, 0.75, 0]} size={[0.12, 1.5, 0.12]} color="#303a45" />
      <mesh position={[0, 1.6, 0]}><sphereGeometry args={[0.23, 8, 8]} /><meshStandardMaterial color="#ffeba8" emissive="#ffd287" emissiveIntensity={night ? 3 : 0.1} /></mesh>
      {night && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}><circleGeometry args={[1.5, 24]} /><meshBasicMaterial color="#ffdb91" transparent opacity={0.16} depthWrite={false} /></mesh>}
    </group>))}
    <Lighthouse night={night} />
    {night && <NightSky />}
  </group>;
}
