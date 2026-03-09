import type { DrawingCanvasOptions, Filter, Path, Point } from "./types";

export class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private cap: CanvasLineCap;
  private color: string;
  private brightnessRange: number;
  private blur: number;
  private getScale: () => number | null;
  private paths: Path[] = [];
  private activePath: Path | null = null;
  private isPainting = false;

  public constructor(
    canvas: HTMLCanvasElement,
    getScale: () => number | null,
    options: DrawingCanvasOptions,
  ) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D context is not available for the provided canvas.");
    }

    this.canvas = canvas;
    this.ctx = context;
    this.cap = options.cap;
    this.width = options.width;
    this.color = options.color;
    this.brightnessRange = options.brightnessRange;
    this.blur = options.blur;
    this.getScale = getScale;
  }

  private createFilter(): Filter {
    const blur = Math.max(0, this.blur);
    const brightnessRange = Math.max(0, this.brightnessRange);
    const brightnessFactor =
      brightnessRange === 0 ? 1 : 1 + (Math.random() * 2 - 1) * brightnessRange;

    return {
      blur,
      brightnessFactor,
    };
  }

  public setCanvasSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private getCanvasPoint(event: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private toLogicalPoint(point: Point, scale: number): Point {
    return {
      x: point.x / scale,
      y: point.y / scale,
    };
  }

  private toCanvasPoint(point: Point, scale: number): Point {
    return {
      x: point.x * scale,
      y: point.y * scale,
    };
  }

  private drawPath(path: Path, scale: number): void {
    if (path.points.length === 0) {
      return;
    }

    this.ctx.lineWidth = path.lineWidth * scale;
    this.ctx.lineCap = path.lineCap;
    this.ctx.strokeStyle = path.strokeStyle;
    this.ctx.filter = `blur(${path.filter.blur * scale}px) brightness(${path.filter.brightnessFactor})`;

    this.ctx.beginPath();
    const firstPoint = this.toCanvasPoint(path.points[0], scale);
    this.ctx.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i < path.points.length; i += 1) {
      const point = this.toCanvasPoint(path.points[i], scale);
      this.ctx.lineTo(point.x, point.y);
    }

    if (path.points.length === 1) {
      this.ctx.lineTo(firstPoint.x, firstPoint.y);
    }

    this.ctx.stroke();
    this.ctx.filter = "none";
  }

  public render(): void {
    const scale = this.getScale();

    if (!scale) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const path of this.paths) {
      this.drawPath(path, scale);
    }
  }

  public renderActivePath(): void {
    const scale = this.getScale();

    if (!scale) {
      return;
    }

    if (!this.activePath) {
      return;
    }

    this.drawPath(this.activePath, scale);
  }

  private handlePointerDown = (event: PointerEvent): void => {
    const scale = this.getScale();

    if (!scale) {
      return;
    }

    const canvasPoint = this.getCanvasPoint(event);

    this.isPainting = true;
    const logicalPoint = this.toLogicalPoint(canvasPoint, scale);

    this.activePath = {
      points: [logicalPoint],
      lineWidth: this.width,
      strokeStyle: this.color,
      lineCap: this.cap,
      filter: this.createFilter(),
    };

    this.paths.push(this.activePath);
    this.renderActivePath();
  };

  private handlePointerUp = (): void => {
    this.isPainting = false;
    this.activePath = null;
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.isPainting || !this.activePath) {
      return;
    }

    const scale = this.getScale();

    if (!scale) {
      return;
    }

    const canvasPoint = this.getCanvasPoint(event);

    const logicalPoint = this.toLogicalPoint(canvasPoint, scale);

    this.activePath.points.push(logicalPoint);
    this.renderActivePath();
  };

  public init(): void {
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
  }

  public destroy(): void {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
  }
}
