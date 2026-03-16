export interface Path {
  points: Point[];
  options: Options;
}

export interface Point {
  x: number;
  y: number;
}

export interface Options {
  width: number;
  color: string;
  cap: CanvasLineCap;
  brightness: number;
}
