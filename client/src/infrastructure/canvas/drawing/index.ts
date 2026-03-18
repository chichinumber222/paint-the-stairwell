import type { Options, Path, Point } from "./types";

export class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: Options;
  private scale = 1;
  private paths: Path[] = [];
  private activePath: Path | null = null;
  private activePointerId: number | null = null;
  private isPainting = false;

  public constructor(canvas: HTMLCanvasElement, options: Options) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D context is not available for the provided canvas.");
    }

    this.canvas = canvas;
    this.ctx = context;
    this.options = options;
  }

  public setOptions(options: Partial<Options>): void {
    this.options = { ...this.options, ...options };
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

  public setCanvasSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public replacePaths(paths: Path[]): void {
    this.cancelActiveDrawing();
    this.paths = paths.map((path) => ({
      points: path.points,
      options: { ...path.options },
    }));
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

  private applyPathOptionsToContext(
    ctx: CanvasRenderingContext2D,
    path: Path,
    scale: number,
  ): void {
    ctx.lineWidth = path.options.width * scale;
    ctx.lineCap = path.options.cap;
    ctx.strokeStyle = path.options.color;
    ctx.filter = `brightness(${path.options.brightness * 100}%)`;
  }

  private resetOptionsFromContext(ctx: CanvasRenderingContext2D): void {
    ctx.filter = "none";
  }

  private cancelActiveDrawing(): void {
    this.isPainting = false;
    this.activePath = null;
    this.activePointerId = null;
  }

  private renderActiveLine(scale: number): void {
    if (!this.activePath || this.activePath.points.length === 0) {
      return;
    }

    this.applyPathOptionsToContext(this.ctx, this.activePath, scale);

    this.ctx.beginPath();

    const lastIndex = this.activePath.points.length - 1;

    const fromPoint = this.toCanvasPoint(
      this.activePath.points[lastIndex - 1] || this.activePath.points[lastIndex],
      scale,
    );
    const toPoint = this.toCanvasPoint(this.activePath.points[lastIndex], scale);

    this.ctx.moveTo(fromPoint.x, fromPoint.y);
    this.ctx.lineTo(toPoint.x, toPoint.y);

    this.ctx.stroke();

    this.resetOptionsFromContext(this.ctx);
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderTo(this.ctx, this.scale);
  }

  public renderTo(ctx: CanvasRenderingContext2D, scale: number): void {
    for (const path of this.paths) {
      if (path.points.length === 0) {
        continue;
      }

      this.applyPathOptionsToContext(ctx, path, scale);

      ctx.beginPath();

      if (path.points.length === 1) {
        const singlePoint = this.toCanvasPoint(path.points[0], scale);
        ctx.moveTo(singlePoint.x, singlePoint.y);
        ctx.lineTo(singlePoint.x, singlePoint.y);
        ctx.stroke();
        this.resetOptionsFromContext(ctx);
        continue;
      }

      for (let i = 1; i < path.points.length; i += 1) {
        const fromPoint = this.toCanvasPoint(path.points[i - 1], scale);
        const toPoint = this.toCanvasPoint(path.points[i], scale);

        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.lineTo(toPoint.x, toPoint.y);
      }

      ctx.stroke();

      this.resetOptionsFromContext(ctx);
    }
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (this.activePointerId !== null) {
      return;
    }

    const scale = this.scale;

    this.isPainting = true;

    this.activePointerId = event.pointerId;

    const canvasPoint = this.getCanvasPoint(event);
    const logicalPoint = this.toLogicalPoint(canvasPoint, scale);

    const createdPath: Path = {
      points: [logicalPoint],
      options: { ...this.options },
    };

    this.activePath = createdPath;
    this.paths.push(createdPath);

    this.renderActiveLine(scale);
  };

  private handlePointerUp = (event: PointerEvent): void => {
    if (this.activePointerId !== event.pointerId) {
      return;
    }
    this.cancelActiveDrawing();
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (
      !this.isPainting ||
      this.activePath === null ||
      this.activePointerId === null ||
      this.activePointerId !== event.pointerId
    ) {
      return;
    }

    const scale = this.scale;

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
