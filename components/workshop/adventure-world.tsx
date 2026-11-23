import { CLUES, COVE, MAIN_DOCK, COVE_DOCK, type Clue } from "@/lib/adventure";
import { Block, Disc } from "./objects";

export const COVE_ROCKS = [
  { x: 55, z: -5, halfX: 1.1, halfZ: 1 },
  { x: 48, z: -6, halfX: 0.45, halfZ: 0.45 },
  { x: 54, z: 6, halfX: 0.45, halfZ: 0.45 },
];

export function FerryModel() {
  return <group position={[0, -0.6, 0]}>
    <Block size={[3, 0.55, 4.4]} color="#1a4976" castShadow={false} />
    <Block position={[0, 0.4, 0]} size={[2.85, 0.3, 4.35]} color="#deb486" />
    {[-1.32, 1.32].map((x) => <Block key={x} position={[x, 0.76, 0]} size={[0.13, 0.47, 4.25]} color="#ede3ce" />)}
    <Block position={[0, 0.66, 1.95]} size={[0.85, 0.4, 0.24]} color="#fbb06d" />
  </group>;
}

export function AdventureWorld({ night, found, onBottle }: { night: boolean; found: Clue[]; onBottle: () => void }) {
  return <group>
    <Block position={[COVE.x, -0.45, 0]} size={[17.4, 0.45, 19.4]} color="#ceb68c" />
    <Block position={[COVE.x, -0.22, 0]} size={[COVE.width, 0.44, COVE.depth]} color={night ? "#385957" : "#80aa98"} />
    <Block position={[49.3, 0.018, 1.5]} size={[12, 0.035, 2.3]} color="#cfc7a9" castShadow={false} />
    <Block position={[51, 0.02, -2]} size={[2.3, 0.04, 7]} color="#cfc7a9" castShadow={false} />
    {[MAIN_DOCK, COVE_DOCK].map(({ x, z }) => <group key={x} position={[x, 0, z]}>
      <Block position={[0, 0.04, 0]} size={[4, 0.13, 3.5]} color="#c39662" />
      {[-1.6, 1.6].map((edge) => <Block key={edge} position={[0, 0.52, edge]} size={[0.22, 1.04, 0.22]} color="#355464" />)}
      <mesh position={[0, 1.12, 1.6]}>
        <sphereGeometry args={[0.15, 12, 8]} />
        <meshBasicMaterial color="#ffc97c" />
      </mesh>
    </group>)}
    {COVE_ROCKS.map(({ x, z }, index) => <group key={x} position={[x, 0, z]}>
      {index === 0 ? <mesh position={[0, 0.85, 0]} scale={[1.6, 1.4, 1.3]} castShadow>
        <dodecahedronGeometry args={[1]} /><meshStandardMaterial color="#6e8580" />
      </mesh> : <>
        <Block position={[0, 0.85, 0]} size={[0.25, 1.7, 0.25]} color="#8d6f54" />
        {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0, 1.78, 0]} rotation={[0.32, i * Math.PI * 0.4, 0]}>
          <boxGeometry args={[0.4, 0.1, 2]} /><meshStandardMaterial color="#4f956c" />
        </mesh>)}
      </>}
    </group>)}
    {CLUES.map((clue) => <group key={clue.id} position={[clue.x, 0, clue.z]}
      onClick={clue.id === "bottle" ? (event) => { if (event.delta < 5) onBottle(); } : undefined}>
      <Disc position={[0, 0.07, 0]} radius={0.56} height={0.14} color={found.includes(clue.id) ? "#798d81" : "#b19a72"} />
      {!found.includes(clue.id) && <mesh position={[0, 0.65, 0]} rotation={[0.3, 0.5, 0.2]}>
        <octahedronGeometry args={[clue.id === "bottle" ? 0.55 : 0.38]} />
        <meshStandardMaterial color="#ffda84" emissive="#ed9530" emissiveIntensity={night ? 1.4 : 0.37} />
      </mesh>}
    </group>)}
  </group>;
}
