import type { BackgroundCanvas } from "../infrastructure/canvas/background";
import type { DrawingCanvas } from "../infrastructure/canvas/drawing";
import type { ExportService } from "./export/ExportService";
import type { ExportState } from "./export/types";
import type { Options, Path } from "./types";

export class App {
  private background: BackgroundCanvas;
  private drawing: DrawingCanvas;
  private exportService: ExportService;
  private scale: number | null = null;

  public constructor({
    background,
    drawing,
    exportService,
  }: {
    background: BackgroundCanvas;
    drawing: DrawingCanvas;
    exportService: ExportService;
  }) {
    this.background = background;
    this.drawing = drawing;
    this.exportService = exportService;
  }

  private renderAll = (): void => {
    this.background.render();
    this.drawing.render();
  };

  public syncAndRender = (): void => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    this.background.setCanvasSize(windowWidth, windowHeight);
    this.drawing.setCanvasSize(windowWidth, windowHeight);
    this.scale = this.background.calculateScale();
    if (this.scale !== null) this.drawing.setScale(this.scale);

    this.renderAll();
  };

  public subscribeToExportState(listener: (state: ExportState) => void): () => void {
    return this.exportService.subscribe(listener);
  }

  public clearExportError(): void {
    this.exportService.clearError();
  }

  public async handleExport(): Promise<boolean> {
    return this.exportService.export({
      fileName: "stairwell.png",
      getExportSize: () => this.background.getOriginalImageSize(),
      renderExportContent: (ctx, scale) => {
        this.background.renderImage(ctx, scale);
        this.drawing.renderImage(ctx, scale);
      },
    });
  }

  public setOptions(options: Options): void {
    this.drawing.setOptions(options);
  }

  public setInitialData(data: Path[]): void {
    this.drawing.setInitialPaths(data);
  }

  public handleUndo(): void {
    this.drawing.deleteLastUserPath();
    this.renderAll();
  }

  public handleDeleteAll(): void {
    this.drawing.clearUserPaths();
    this.renderAll();
  }
}

export default App;
