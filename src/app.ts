export type Point = {
  x: number;
  y: number;
};

export type Options = {
  lineWidth?: number;
  strokeStyle?: string;
  lineCap?: CanvasLineCap;
};

export class App {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lineWidth: number;
  private lineCap: CanvasLineCap;
  private strokeStyle: string;
  private isPainting = false;
  private coord: Point = { x: 0, y: 0 };

  public constructor(canvas: HTMLCanvasElement, options: Options = {}) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D context is not available for the provided canvas.");
    }

    this.canvas = canvas;
    this.ctx = context;
    this.lineCap = options.lineCap ?? "round";
    this.lineWidth = options.lineWidth ?? 5;
    this.strokeStyle = options.strokeStyle ?? "green";
  }

  private getPosition(event: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  public handlePointerDown = (event: PointerEvent): void => {
    this.isPainting = true;
    this.coord = this.getPosition(event);
  };

  private handlePointerUp = (): void => {
    this.isPainting = false;
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.isPainting) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = this.lineCap;
    this.ctx.strokeStyle = this.strokeStyle;

    this.ctx.moveTo(this.coord.x, this.coord.y);
    this.coord = this.getPosition(event);
    this.ctx.lineTo(this.coord.x, this.coord.y);
    this.ctx.stroke();
  };

  private resize = (): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.canvas.width = rect.width;
    this.ctx.canvas.height = rect.height;
  };

  public init() {
    this.resize();
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);

    window.addEventListener("resize", this.resize);
  }

  public destroy() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);

    window.removeEventListener("resize", this.resize);
  }
}

export default App;
