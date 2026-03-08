import backgroundImageUrl from "../assets/elevator.png";
import { BackgroundCanvas } from "../canvas/background-canvas";
import { DrawingCanvas } from "../canvas/drawing-canvas.ts";

export type Options = {
  lineWidth?: number;
  strokeStyle?: string;
  lineCap?: CanvasLineCap;
};

export class App {
  private background: BackgroundCanvas;
  private drawing: DrawingCanvas;
  private scale: number | null = null;

  public constructor(
    backgroundCanvas: HTMLCanvasElement,
    drawingCanvas: HTMLCanvasElement,
    options: Options = {},
  ) {
    this.drawing = new DrawingCanvas(drawingCanvas, () => this.scale, {
      lineCap: options.lineCap,
      lineWidth: options.lineWidth,
      strokeStyle: options.strokeStyle,
    });

    this.background = new BackgroundCanvas(
      backgroundCanvas,
      backgroundImageUrl,
      () => this.scale,
      this.syncAndRender,
    );
  }

  private renderAll = (): void => {
    this.background.render();
    this.drawing.render();
  };

  private syncAndRender = (): void => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    this.background.setCanvasSize(canvasWidth, canvasHeight);
    this.drawing.setCanvasSize(canvasWidth, canvasHeight);
    this.scale = this.background.calculateScale();

    this.renderAll();
  };

  public init(): void {
    this.syncAndRender();
    this.drawing.init();
    window.addEventListener("resize", this.syncAndRender);
  }

  public destroy(): void {
    this.drawing.destroy();
    window.removeEventListener("resize", this.syncAndRender);
  }
}

export default App;
