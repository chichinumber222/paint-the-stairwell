import type { ExportConfig, ExportState, ExportStateListener } from "./types";
import UPNG from "upng-js";

export class ExportService {
  private state: ExportState = {
    isLoading: false,
    error: null,
  };
  private listeners = new Set<ExportStateListener>();

  public subscribe(listener: ExportStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public async export(config: ExportConfig): Promise<boolean> {
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

      const exportSize = config.getExportSize();

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

      config.renderExportContent(finalContext, exportScale);

      const imageData = finalContext.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
      const pngBinary = UPNG.encode(
        [imageData.data.buffer],
        finalCanvas.width,
        finalCanvas.height,
        0,
      );

      const blob = new Blob([pngBinary], { type: "image/png" });
      const dataUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = config.fileName;
      link.click();

      this.setState({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed with unknown error.";

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
