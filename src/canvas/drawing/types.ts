export type Point = {
  x: number;
  y: number;
};

export type DrawingCanvasOptions = {
  width: number;
  color: string;
  cap: CanvasLineCap;
  brightnessRange: number;
  blur: number;
};

export type Filter = {
  blur: number;
  brightnessFactor: number;
};

export type Path = {
  points: Point[];
  lineWidth: number;
  strokeStyle: string;
  lineCap: CanvasLineCap;
  filter: Filter;
};
