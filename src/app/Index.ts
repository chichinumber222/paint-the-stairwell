import { BackgroundCanvas } from "../canvas/background";
import { DrawingCanvas } from "../canvas/drawing";
import { DEFAULT_DRAWING_OPTIONS } from "./constants";
import type { BackgroundConfig, DrawingConfig } from "./types";

export class App {
  private background: BackgroundCanvas;
  private drawing: DrawingCanvas;
  private scale: number | null = null;

  public constructor(
    {
      canvas: backgroundCanvas,
      imageUrl: backgroundImageUrl,
    }: BackgroundConfig,
    { canvas: drawingCanvas, options: drawingOptions }: DrawingConfig,
  ) {
    this.background = new BackgroundCanvas(
      backgroundCanvas,
      backgroundImageUrl,
      () => this.scale,
    );

    this.drawing = new DrawingCanvas(drawingCanvas, () => this.scale, {
      ...DEFAULT_DRAWING_OPTIONS,
      ...drawingOptions,
    });
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

  public async init(): Promise<void> {
    this.drawing.init();
    await this.background.init();
    this.syncAndRender();
    window.addEventListener("resize", this.syncAndRender);
  }

  public destroy(): void {
    this.drawing.destroy();
    this.background.destroy();
    window.removeEventListener("resize", this.syncAndRender);
  }

  public handleExport() {
    const finalCanvas = document.createElement("canvas");
    const finalContext = finalCanvas.getContext("2d");
    if (!finalContext) return;

    const backgroundImageSize = this.background.getOriginalImageSize();
    if (!backgroundImageSize) return;
    const exportScale = 1;
    finalCanvas.width = backgroundImageSize.width * exportScale;
    finalCanvas.height = backgroundImageSize.height * exportScale;

    this.background.renderTo(finalContext, exportScale);
    this.drawing.renderTo(finalContext, exportScale);

    const dataUrl = finalCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "stairwell.png";
    link.click();
  }
}

export default App;
