import type App from "../../application/app";

export class ExportControlsBinder {
  private app: App;
  private exportButtonElement: HTMLButtonElement;
  private exportStatusElement: HTMLParagraphElement;

  constructor(
    app: App,
    exportButtonElement: HTMLButtonElement,
    exportStatusElement: HTMLParagraphElement,
  ) {
    this.app = app;
    this.exportButtonElement = exportButtonElement;
    this.exportStatusElement = exportStatusElement;
  }

  public init(): () => void {
    const onClickButton = () => void this.app.handleExport();
    this.exportButtonElement.addEventListener("click", onClickButton);

    const unsubscribeExportState = this.app.subscribeToExportState((state) => {
      this.exportButtonElement.disabled = state.isLoading;
      this.exportStatusElement.textContent = state.error ?? "";
      this.exportStatusElement.hidden = !state.error;
      if (state.error) this.exportStatusElement.focus();
    });

    const onBlurStatus = () => this.app.clearExportError();
    this.exportStatusElement.addEventListener("blur", onBlurStatus);

    return () => {
      this.exportButtonElement.removeEventListener("click", onClickButton);
      this.exportStatusElement.removeEventListener("blur", onBlurStatus);
      unsubscribeExportState();
    };
  }
}
