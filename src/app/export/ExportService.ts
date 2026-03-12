import type {
  ExportServiceConfig,
  ExportState,
  ExportStateListener,
} from "./types";

export class ExportService {
  private readonly config: ExportServiceConfig;
  private state: ExportState = {
    isLoading: false,
    error: null,
  };
  private listeners = new Set<ExportStateListener>();

  public constructor(config: ExportServiceConfig) {
    this.config = config;
  }

  public subscribe(listener: ExportStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public async export(): Promise<boolean> {
    if (this.state.isLoading) {
      return false;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const finalCanvas = document.createElement("canvas");
      const finalContext = finalCanvas.getContext("2d");

      if (!finalContext) {
        this.setState({
          isLoading: false,
          error: "Export failed: could not create 2D context.",
        });
        return false;
      }

      const exportSize = this.config.getExportSize();

      if (!exportSize) {
        this.setState({
          isLoading: false,
          error: "Export failed: export size is unavailable.",
        });
        return false;
      }

      const exportScale = 1;
      finalCanvas.width = exportSize.width * exportScale;
      finalCanvas.height = exportSize.height * exportScale;

      this.config.renderExportContent(finalContext, exportScale);

      const dataUrl = finalCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = this.config.fileName;
      link.click();

      this.setState({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Export failed with unknown error.";

      this.setState({
        isLoading: false,
        error: message,
      });
      return false;
    }
  }

  private setState(next: ExportState): void {
    this.state = next;

    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public clearError(): void {
    if (this.state.error) {
      this.setState({ ...this.state, error: null });
    }
  }
}
