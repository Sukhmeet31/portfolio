export const WORLD = { width: 64, depth: 50, maxX: 31.2, maxZ: 24.2 };
export const destinations = [
  { id: "home", name: "Project courtyard", x: 0, z: 2.8 },
  { id: "race", name: "Racing track", x: -21, z: 13 },
  { id: "bowling", name: "Bowling lane", x: 21, z: 3 },
  { id: "stunts", name: "Stunt garden", x: 18, z: 10 },
  { id: "coast", name: "Ocean pier", x: 22, z: 21 },
] as const;
export type DestinationId = (typeof destinations)[number]["id"];
export const toys = [
  {
    id: "sculpture",
    name: "Spin sculpture",
    x: -5.9,
    z: 3.4,
    height: 3.3,
    halfX: 1.05,
    halfZ: 1.05,
  },
  {
    id: "plane",
    name: "Launch paper plane",
    x: 5.5,
    z: 3.5,
    height: 2.5,
    halfX: 1.15,
    halfZ: 0.8,
  },
  {
    id: "paint",
    name: "Repaint rover",
    x: 0,
    z: 5.9,
    height: 2.4,
    halfX: 0,
    halfZ: 0,
  },
] as const;
export type ToyId = (typeof toys)[number]["id"];
export const roverPaints = [
  { name: "Cobalt", color: "#4355f9" },
  { name: "Sage", color: "#8d9e72" },
  { name: "Ink", color: "#303641" },
] as const;
export type PlaygroundActions = {
  sculpture: number;
  plane: number;
  paint: number;
};
