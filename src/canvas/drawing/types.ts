export type Path = {
  points: Point[];
  options: Options;
};

export type Point = {
  x: number;
  y: number;
};

export type Options = {
  width: number;
  color: string;
  cap: CanvasLineCap;
  brightness: number;
  blur: number;
};
