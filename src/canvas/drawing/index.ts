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

  private getFilter(): Filter {
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

  private applyPathSettings(path: Path, scale: number): void {
    this.ctx.lineWidth = path.lineWidth * scale;
    this.ctx.lineCap = path.lineCap;
    this.ctx.strokeStyle = path.strokeStyle;
    this.ctx.filter = `blur(${path.filter.blur * scale}px) brightness(${path.filter.brightnessFactor})`;
  }

  private resetSettings(): void {
    this.ctx.filter = "none";
  }

  private renderActiveLine(scale: number): void {
    if (!this.activePath || this.activePath.points.length === 0) {
      return;
    }

    this.applyPathSettings(this.activePath, scale);

    this.ctx.beginPath();

    const lastIndex = this.activePath.points.length - 1;

    const fromPoint = this.toCanvasPoint(
      this.activePath.points[lastIndex - 1] ||
        this.activePath.points[lastIndex],
      scale,
    );
    const toPoint = this.toCanvasPoint(
      this.activePath.points[lastIndex],
      scale,
    );

    this.ctx.moveTo(fromPoint.x, fromPoint.y);
    this.ctx.lineTo(toPoint.x, toPoint.y);

    this.ctx.stroke();

    this.resetSettings();
  }

  public render(): void {
    const scale = this.getScale();

    if (!scale) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const path of this.paths) {
      if (path.points.length === 0) {
        continue;
      }

      this.applyPathSettings(path, scale);

      this.ctx.beginPath();

      for (let i = 1; i < path.points.length; i += 1) {
        const fromPoint = this.toCanvasPoint(
          path.points[i - 1] || path.points[i],
          scale,
        );
        const toPoint = this.toCanvasPoint(path.points[i], scale);

        this.ctx.moveTo(fromPoint.x, fromPoint.y);
        this.ctx.lineTo(toPoint.x, toPoint.y);
      }

      this.ctx.stroke();

      this.resetSettings();
    }
  }

  private handlePointerDown = (event: PointerEvent): void => {
    const scale = this.getScale();

    if (!scale) {
      return;
    }

    const canvasPoint = this.getCanvasPoint(event);
    const logicalPoint = this.toLogicalPoint(canvasPoint, scale);

    this.isPainting = true;

    const createdPath: Path = {
      points: [logicalPoint],
      lineWidth: this.width,
      strokeStyle: this.color,
      lineCap: this.cap,
      filter: this.getFilter(),
    };

    this.activePath = createdPath;
    this.paths.push(createdPath);

    this.renderActiveLine(scale);
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

    this.renderActiveLine(scale);
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
