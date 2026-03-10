import backgroundImageUrl from "../assets/elevator.png";
import { BackgroundCanvas } from "../canvas/background";
import { DrawingCanvas } from "../canvas/drawing";
import { DEFAULT_DRAWING_OPTIONS } from "./constants";
import type { Options } from "./types";

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
      ...DEFAULT_DRAWING_OPTIONS,
      ...options,
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
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    this.background.setCanvasSize(windowWidth, windowHeight);
    this.drawing.setCanvasSize(windowWidth, windowHeight);
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
