import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { DoubleSide, type Group } from "three";
import {
  toys,
  roverPaints,
  type PlaygroundActions,
  type ToyId,
} from "@/lib/workshop-world";
import { Block, Disc } from "./objects";

type Props = {
  actions: PlaygroundActions;
  reducedMotion: boolean;
  onPlay: (id: ToyId) => void;
  onComplete: (id: "sculpture" | "plane") => void;
};

function PaperPlane() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <bufferGeometry
          onUpdate={(geometry) => geometry.computeVertexNormals()}
        >
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -0.8, -0.45, 0, 0, 1, 0, 0, -0.3, 0.2, 0, -0.3, 0.2, 0, 1, 0,
                0.8, -0.45, 0,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <meshStandardMaterial
          color="#f3f0df"
          side={DoubleSide}
          roughness={0.7}
        />
      </mesh>
      <Block
        position={[0, 0.03, 0.1]}
        size={[0.035, 0.02, 0.8]}
        color="#4355f9"
      />
    </group>
  );
}

export function Playground({
  actions,
  reducedMotion,
  onPlay,
  onComplete,
}: Props) {
  const rotor = useRef<Group>(null);
  const plane = useRef<Group>(null);
  const spin = useRef({ elapsed: 0, running: false, from: 0 });
  const flight = useRef({ elapsed: 0, running: false });
  const invalidate = useThree((s) => s.invalidate);
  const paint = roverPaints[actions.paint % roverPaints.length];
  useEffect(() => {
    if (!actions.sculpture) return;
    spin.current = {
      elapsed: 0,
      running: true,
      from: rotor.current?.rotation.y ?? 0,
    };
    invalidate();
  }, [actions.sculpture, invalidate]);
  useEffect(() => {
    if (!actions.plane) return;
    flight.current = { elapsed: 0, running: true };
    invalidate();
  }, [actions.plane, invalidate]);
  useFrame((_, delta) => {
    if (document.hidden) return;
    const dt = Math.min(delta, 0.05);
    if (spin.current.running && rotor.current) {
      spin.current.elapsed += dt;
      const t = reducedMotion ? 1 : Math.min(spin.current.elapsed / 3.2, 1);
      rotor.current.rotation.y =
        spin.current.from + (1 - (1 - t) ** 3) * Math.PI * 4.5;
      if (t === 1) {
        spin.current.running = false;
        onComplete("sculpture");
      } else invalidate();
    }
    if (flight.current.running && plane.current) {
      flight.current.elapsed += dt;
      const t = reducedMotion ? 1 : Math.min(flight.current.elapsed / 5, 1);
      // A short circuit over the play yard; returns to the actual launch pad.
      const angle = t * Math.PI * 2;
      plane.current.position.set(
        5.5 - 5 * Math.sin(angle),
        1.5 + Math.sin(Math.PI * t) * 3.5,
        3.5 - 2.5 * (1 - Math.cos(angle)),
      );
      plane.current.rotation.set(
        0,
        Math.atan2(-5 * Math.cos(angle), -2.5 * Math.sin(angle)),
        Math.sin(angle) * -0.25,
      );
      if (t === 1) {
        flight.current.running = false;
        plane.current.rotation.set(0, -Math.PI / 2, 0);
        onComplete("plane");
      } else invalidate();
    }
  });
  return (
    <group>
      <group
        position={[toys[0].x, 0, toys[0].z]}
        onClick={(e) => {
          e.stopPropagation();
          onPlay("sculpture");
        }}
      >
        <Disc
          position={[0, 0.14, 0]}
          radius={1.15}
          height={0.28}
          color="#bbc3b0"
        />
        <Block
          position={[0, 1.05, 0]}
          size={[0.17, 1.9, 0.17]}
          color="#282b28"
        />
        <group ref={rotor} position={[0, 2.1, 0]}>
          <mesh rotation={[Math.PI / 3, 0.3, 0]} castShadow>
            <torusGeometry args={[0.85, 0.12, 10, 40]} />
            <meshStandardMaterial color="#4355f9" roughness={0.45} />
          </mesh>
          <mesh rotation={[-Math.PI / 3, -0.3, 0]} castShadow>
            <torusGeometry args={[0.62, 0.08, 10, 32]} />
            <meshStandardMaterial color="#ebe9de" roughness={0.5} />
          </mesh>
          <mesh castShadow>
            <sphereGeometry args={[0.2, 16, 12]} />
            <meshStandardMaterial color="#4355f9" />
          </mesh>
        </group>
      </group>
      <group
        position={[toys[1].x, 0, toys[1].z]}
        onClick={(e) => {
          e.stopPropagation();
          onPlay("plane");
        }}
      >
        <Block position={[0, 0.2, 0]} size={[2.3, 0.4, 1.5]} color="#c5c9b9" />
        <Block position={[0, 0.45, 0]} size={[2.4, 0.1, 1.6]} color="#4355f9" />
        <Block
          position={[0, 0.9, 0]}
          size={[0.12, 0.8, 0.12]}
          color="#282b28"
        />
        {[-0.6, -0.2, 0.2, 0.6].map((x) => (
          <Block key={x} position={[x, 0.51, 0]} size={[0.25, 0.01, 0.035]} />
        ))}
      </group>
      <group
        ref={plane}
        position={[5.5, 1.5, 3.5]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPlay("plane");
        }}
      >
        <PaperPlane />
      </group>
      <group
        position={[toys[2].x, 0, toys[2].z]}
        onClick={(e) => {
          e.stopPropagation();
          onPlay("paint");
        }}
      >
        <Block
          position={[0, 0.04, 0]}
          size={[2.4, 0.05, 2]}
          color={paint.color}
        />
        {[-1.2, 1.2].map((x) => (
          <Block
            key={x}
            position={[x, 0.9, -0.65]}
            size={[0.13, 1.8, 0.13]}
            color="#282b28"
          />
        ))}
        <Block
          position={[0, 1.8, -0.65]}
          size={[2.65, 0.22, 0.35]}
          color={paint.color}
        />
        {roverPaints.map((p, i) => (
          <Disc
            key={p.name}
            position={[1.7, 0.25, -0.7 + i * 0.65]}
            radius={0.22}
            height={0.5}
            color={p.color}
          />
        ))}
      </group>
    </group>
  );
}
