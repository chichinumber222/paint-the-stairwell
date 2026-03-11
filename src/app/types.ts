import type { Options as DrawingOptions } from "../canvas/drawing/types";

export type Options = Partial<DrawingOptions>;

export interface BackgroundConfig {
  canvas: HTMLCanvasElement;
  imageUrl: string;
}

export interface DrawingConfig {
  canvas: HTMLCanvasElement;
  options?: Options;
}
