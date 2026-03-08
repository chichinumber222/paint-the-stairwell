export type Point = {
  x: number;
  y: number;
};

export type DrawingCanvasOptions = {
  lineWidth?: number;
  strokeStyle?: string;
  lineCap?: CanvasLineCap;
};

type StrokePath = {
  points: Point[];
  lineWidth: number;
  strokeStyle: string;
  lineCap: CanvasLineCap;
};

export class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lineWidth: number;
  private lineCap: CanvasLineCap;
  private strokeStyle: string;
  private getScale: () => number | null;
  private paths: StrokePath[] = [];
  private activePath: StrokePath | null = null;
  private isPainting = false;

  public constructor(
    canvas: HTMLCanvasElement,
    getScale: () => number | null,
    options: DrawingCanvasOptions = {},
  ) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D context is not available for the provided canvas.");
    }

    this.canvas = canvas;
    this.ctx = context;
    this.lineCap = options.lineCap ?? "round";
    this.lineWidth = options.lineWidth ?? 5;
    this.strokeStyle = options.strokeStyle ?? "green";
    this.getScale = getScale;
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

  private toLogicalPoint(point: Point): Point {
    const scale = this.getScale();

    if (!scale) {
      return point;
    }

    return {
      x: point.x / scale,
      y: point.y / scale,
    };
  }

  private toCanvasPoint(point: Point): Point {
    const scale = this.getScale();

    if (!scale) {
      return point;
    }

    return {
      x: point.x * scale,
      y: point.y * scale,
    };
  }

  private drawPaths(): void {
    const scale = this.getScale();

    if (!scale) {
      return;
    }

    for (const path of this.paths) {
      if (path.points.length === 0) {
        continue;
      }

      this.ctx.beginPath();
      this.ctx.lineWidth = path.lineWidth * scale;
      this.ctx.lineCap = path.lineCap;
      this.ctx.strokeStyle = path.strokeStyle;

      const firstPoint = this.toCanvasPoint(path.points[0]);
      this.ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < path.points.length; i += 1) {
        const point = this.toCanvasPoint(path.points[i]);
        this.ctx.lineTo(point.x, point.y);
      }

      if (path.points.length === 1) {
        this.ctx.lineTo(firstPoint.x, firstPoint.y);
      }

      this.ctx.stroke();
    }
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPaths();
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (!this.getScale()) {
      return;
    }

    const canvasPoint = this.getCanvasPoint(event);

    this.isPainting = true;
    const logicalPoint = this.toLogicalPoint(canvasPoint);

    this.activePath = {
      points: [logicalPoint],
      lineWidth: this.lineWidth,
      strokeStyle: this.strokeStyle,
      lineCap: this.lineCap,
    };

    this.paths.push(this.activePath);
    this.render();
  };

  private handlePointerUp = (): void => {
    this.isPainting = false;
    this.activePath = null;
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.getScale() || !this.isPainting || !this.activePath) {
      return;
    }

    const canvasPoint = this.getCanvasPoint(event);

    const logicalPoint = this.toLogicalPoint(canvasPoint);

    this.activePath.points.push(logicalPoint);
    this.render();
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
