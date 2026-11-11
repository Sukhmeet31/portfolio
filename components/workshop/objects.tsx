import type { ThreeElements } from "@react-three/fiber";

type Vec3 = [number, number, number];
const colors = {
  chalk: "#ebe9de",
  blue: "#4355f9",
  ink: "#282b28",
  sage: "#969f8a",
  stone: "#b9bcaf",
};

export function Block({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color = colors.chalk,
  ...props
}: { position?: Vec3; size?: Vec3; color?: string } & Omit<
  ThreeElements["mesh"],
  "position" | "scale"
>) {
  return (
    <mesh position={position} castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}
export function Disc({
  position,
  radius,
  height,
  color = colors.chalk,
}: {
  position: Vec3;
  radius: number;
  height: number;
  color?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}
export function DocumentStation() {
  return (
    <group>
      <Block position={[0, 0.25, 0]} size={[1.9, 0.5, 1.65]} color="#b5bcab" />
      <Block position={[0, 0.55, 0]} size={[1.6, 0.1, 1.35]} />
      {[0, 1, 2, 3, 4].map((i) => (
        <group
          key={i}
          position={[i * 0.06 - 0.15, 0.72 + i * 0.19, -i * 0.06]}
          rotation={[0, i * -0.06, 0]}
        >
          <Block
            size={[1.15, 0.13, 1.45]}
            color={i === 4 ? colors.blue : colors.chalk}
          />
          {i === 4 &&
            [0, 1, 2, 3].map((j) => (
              <Block
                key={j}
                position={[-0.12, 0.071, -0.42 + j * 0.25]}
                size={[j === 3 ? 0.4 : 0.75, 0.01, 0.04]}
                color="#c7ceff"
              />
            ))}
        </group>
      ))}
      <Block
        position={[0.65, 1.35, -0.55]}
        size={[0.09, 1.6, 0.09]}
        color={colors.ink}
      />
      <Block
        position={[0.1, 2.12, -0.55]}
        size={[1.2, 0.13, 0.3]}
        color={colors.ink}
      />
      <Block
        position={[0.1, 2.04, -0.55]}
        size={[0.9, 0.02, 0.15]}
        color="#d9e0ff"
      />
    </group>
  );
}
export function TerminalStation() {
  return (
    <group>
      <Block position={[0, 0.28, 0]} size={[1.9, 0.55, 1.35]} color="#c6c9bf" />
      <Block position={[0, 0.6, 0]} size={[1.9, 0.12, 1.35]} />
      <Block
        position={[0, 0.91, -0.15]}
        size={[0.17, 0.6, 0.22]}
        color={colors.ink}
      />
      <Block
        position={[0, 0.68, -0.15]}
        size={[0.7, 0.05, 0.5]}
        color={colors.ink}
      />
      <group position={[0, 1.5, -0.18]} rotation={[-0.08, 0, 0]}>
        <Block size={[1.75, 1.05, 0.18]} color={colors.ink} />
        <Block
          position={[0, 0, 0.1]}
          size={[1.58, 0.87, 0.02]}
          color={colors.blue}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <Block
            key={i}
            position={[-0.3 + (i % 2) * 0.1, 0.28 - i * 0.14, 0.12]}
            size={[i === 2 ? 0.8 : 0.5, 0.025, 0.015]}
            color={i % 2 ? "#a9b6ff" : "#f1efdf"}
          />
        ))}
        <Block
          position={[0.52, 0, 0.12]}
          size={[0.02, 0.65, 0.01]}
          color="#9aa9ff"
        />
      </group>
      <Block
        position={[0, 0.69, 0.4]}
        size={[1.1, 0.06, 0.32]}
        color={colors.ink}
      />
      {[0, 1, 2].map((i) => (
        <Block
          key={i}
          position={[0, 0.73, 0.31 + i * 0.09]}
          size={[0.93, 0.01, 0.025]}
          color="#6e756c"
        />
      ))}
    </group>
  );
}
export function PavilionStation() {
  return (
    <group>
      <Block position={[0, 0.12, 0]} size={[2.1, 0.24, 1.95]} />
      <Block position={[0, 0.25, 0]} size={[1.9, 0.05, 1.75]} color="#cbd0bf" />
      {[-0.8, 0.8].flatMap((x) =>
        [-0.7, 0.7].map((z) => (
          <Block
            key={`${x}-${z}`}
            position={[x, 1.1, z]}
            size={[0.1, 1.8, 0.1]}
          />
        )),
      )}
      <Block
        position={[0, 2.04, 0]}
        size={[2.25, 0.17, 2.1]}
        color={colors.blue}
      />
      {[-0.65, 0, 0.65].map((x) => (
        <Block
          key={x}
          position={[x, 2.14, 0]}
          size={[0.025, 0.025, 2.1]}
          color="#a5b1ff"
        />
      ))}
      <Disc position={[0, 0.65, 0]} radius={0.42} height={0.12} />
      <Disc
        position={[0, 0.45, 0]}
        radius={0.11}
        height={0.5}
        color={colors.ink}
      />
      <Disc
        position={[-0.53, 0.4, 0.35]}
        radius={0.2}
        height={0.3}
        color={colors.sage}
      />
      <Disc
        position={[0.5, 0.4, -0.35]}
        radius={0.2}
        height={0.3}
        color={colors.sage}
      />
    </group>
  );
}
export function RoverModel({ color = colors.blue }: { color?: string }) {
  return (
    <group>
      <Block position={[0, 0.41, 0]} size={[0.76, 0.3, 1]} color={color} />
      <Block position={[0, 0.64, -0.08]} size={[0.48, 0.18, 0.53]} />
      <Block
        position={[0, 0.79, -0.15]}
        size={[0.34, 0.13, 0.18]}
        color={colors.ink}
      />
      <Block
        position={[0, 0.79, -0.25]}
        size={[0.21, 0.05, 0.02]}
        color="#a9bfff"
      />
      <Block
        position={[0, 0.39, -0.51]}
        size={[0.4, 0.05, 0.025]}
        color="#eceacb"
      />
      {[-0.46, 0.46].flatMap((x) =>
        [-0.32, 0.32].map((z) => (
          <group
            key={`${x}-${z}`}
            position={[x, 0.26, z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.16, 16]} />
              <meshStandardMaterial color={colors.ink} roughness={0.9} />
            </mesh>
            <mesh position={[0, x > 0 ? -0.09 : 0.09, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
              <meshStandardMaterial color="#9ba293" />
            </mesh>
          </group>
        )),
      )}
      <Block
        position={[0.22, 0.9, 0.25]}
        size={[0.025, 0.7, 0.025]}
        color={colors.ink}
      />
      <mesh position={[0.22, 1.27, 0.25]}>
        <sphereGeometry args={[0.055, 12, 8]} />
        <meshStandardMaterial color={colors.blue} />
      </mesh>
    </group>
  );
}
export function Architecture({ dusk = false }: { dusk?: boolean }) {
  return (
    <group>
      <Block
        position={[0, -0.25, 0]}
        size={[20, 0.5, 16]}
        color="#c8cbbd"
      />
      <Block
        position={[0, 0.01, 0]}
        size={[19.7, 0.025, 15.7]}
        color="#e7e6dc"
      />
      {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((x) => (
        <Block
          key={`floor-x-${x}`}
          position={[x, 0.03, 0]}
          size={[0.014, 0.007, 15.5]}
          color="#cbcec2"
        />
      ))}
      {[-6, -4, -2, 0, 2, 4, 6].map((z) => (
        <Block
          key={`floor-z-${z}`}
          position={[0, 0.03, z]}
          size={[19.5, 0.007, 0.014]}
          color="#cbcec2"
        />
      ))}
      {/* A generous driving loop separates the project court and the play yard. */}
      <Block position={[0, 0.035, 0]} size={[17, 0.012, 1.8]} color="#d8dcd0" />
      <Block
        position={[-8, 0.035, 0.3]}
        size={[1, 0.012, 11.6]}
        color="#d8dcd0"
      />
      <Block
        position={[8, 0.035, 0.3]}
        size={[1, 0.012, 11.6]}
        color="#d8dcd0"
      />
      <Block
        position={[0, 0.035, 6.5]}
        size={[16, 0.012, 0.9]}
        color="#d8dcd0"
      />
      {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((x) => (
        <Block
          key={`road-${x}`}
          position={[x, 0.048, 0]}
          size={[0.65, 0.01, 0.035]}
          color={colors.blue}
        />
      ))}
      {[-5.6, 0, 5.5].map((x) => (
        <Block
          key={`link-${x}`}
          position={[x, 0.045, -1.4]}
          size={[0.045, 0.01, 1.2]}
          color={colors.blue}
        />
      ))}
      {[-8.6, 8.6].map((x) => (
        <group key={x} position={[x, 0, -6.1]}>
          <Disc
            position={[0, 0.35, 0]}
            radius={0.6}
            height={0.7}
            color="#afb7a3"
          />
          <Block position={[0, 1, 0]} size={[0.1, 1.1, 0.1]} color="#766f5a" />
          <mesh position={[0, 1.5, 0]} castShadow>
            <icosahedronGeometry args={[0.8, 1]} />
            <meshStandardMaterial color="#7f9073" roughness={1} />
          </mesh>
        </group>
      ))}
      {[-8.8, 8.8].flatMap((x) =>
        [-1.8, 5.2].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <Block
              position={[0, 0.5, 0]}
              size={[0.13, 1, 0.13]}
              color={colors.ink}
            />
            <mesh position={[0, 1.05, 0]}>
              <boxGeometry args={[0.3, 0.12, 0.3]} />
              <meshStandardMaterial
                color="#ffedb5"
                emissive="#ffce75"
                emissiveIntensity={dusk ? 3 : 0.1}
              />
            </mesh>
            {dusk && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
                <circleGeometry args={[0.6, 24]} />
                <meshBasicMaterial
                  color="#f8d99b"
                  transparent
                  opacity={0.25}
                  depthWrite={false}
                />
              </mesh>
            )}
          </group>
        )),
      )}
      <Block
        position={[-5.6, 0.5, -6.5]}
        size={[3.3, 0.18, 0.7]}
        color="#b1b9a5"
      />
      {[-6.8, -4.4].map((x) => (
        <Block
          key={x}
          position={[x, 0.25, -6.5]}
          size={[0.16, 0.5, 0.5]}
          color={colors.ink}
        />
      ))}
      <group position={[4.5, 1.75, -7.65]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.7, 0.19, 10, 40]} />
          <meshStandardMaterial color={colors.blue} roughness={0.6} />
        </mesh>
      </group>
      {[0, 1, 2].map((i) => (
        <Block
          key={i}
          position={[-5.6, 1.2 + i * 0.2, -7.65]}
          size={[3.3, 0.05, 0.05]}
          color={colors.blue}
        />
      ))}
      <Block position={[0, 0.15, 8.05]} size={[3, 0.3, 0.7]} />
      <Block
        position={[0, 0.03, 8.55]}
        size={[3.4, 0.08, 0.5]}
        color="#c8cbbd"
      />
    </group>
  );
}
