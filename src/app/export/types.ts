export interface ExportSize {
  width: number;
  height: number;
}

export interface ExportState {
  isLoading: boolean;
  error: string | null;
}

export interface ExportServiceConfig {
  fileName: string;
  getExportSize: () => ExportSize | null;
  renderExportContent: (ctx: CanvasRenderingContext2D, scale: number) => void;
}

export type ExportStateListener = (state: ExportState) => void;
