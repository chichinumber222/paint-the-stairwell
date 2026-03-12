import { BackgroundCanvas } from "../canvas/background";
import { DrawingCanvas } from "../canvas/drawing";
import { ExportService } from "./export/ExportService";
import type { ExportState } from "./export/types";
import { DEFAULT_DRAWING_OPTIONS } from "./constants";
import type { BackgroundConfig, DrawingConfig } from "./types";

export class App {
  private background: BackgroundCanvas;
  private drawing: DrawingCanvas;
  private exportService: ExportService;
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

    this.exportService = new ExportService({
      fileName: "stairwell.png",
      getExportSize: () => this.background.getOriginalImageSize(),
      renderExportContent: (ctx, scale) => {
        this.background.renderTo(ctx, scale);
        this.drawing.renderTo(ctx, scale);
      },
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

    if (this.scale === null) {
      throw new Error(
        "Unable to calculate canvas scale: background image is not ready or has invalid size.",
      );
    }

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

  public subscribeToExportState(
    listener: (state: ExportState) => void,
  ): () => void {
    return this.exportService.subscribe(listener);
  }

  public async handleExport(): Promise<boolean> {
    return this.exportService.export();
  }

  public clearExportError(): void {
    this.exportService.clearError();
  }
}

export default App;
