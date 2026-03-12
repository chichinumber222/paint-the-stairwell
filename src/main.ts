import "./styles/style.css";
import App from "./app/Index";
import backgroundImageUrl from "./assets/elevator.png";
import { ErrorGuard } from "./error-boundary/utils";

const backgroundCanvas = document.querySelector(
  "#app #background-canvas",
) as HTMLCanvasElement;
const drawingCanvas = document.querySelector(
  "#app #drawing-canvas",
) as HTMLCanvasElement;

const exportButton = document.querySelector(
  "#export-button",
) as HTMLButtonElement;
const exportStatus = document.querySelector(
  "#export-status",
) as HTMLParagraphElement;

const errorGuard = new ErrorGuard();
errorGuard.init();

const app = new App(
  {
    canvas: backgroundCanvas,
    imageUrl: backgroundImageUrl,
  },
  {
    canvas: drawingCanvas,
  },
);

const unsubscribeExportState = app.subscribeToExportState((state) => {
  exportButton.disabled = state.isLoading;
  exportStatus.textContent = state.error ?? "";
  exportStatus.hidden = !state.error;
  if (state.error) exportStatus.focus();
});

exportStatus.addEventListener("blur", () => {
  app.clearExportError();
});

window.addEventListener("load", () => {
  void errorGuard.safe(() => app.init(), "App initialization");
});

window.addEventListener("beforeunload", () => {
  void errorGuard.safe(() => app.destroy(), "App destruction");
  void errorGuard.safe(
    () => unsubscribeExportState(),
    "Unsubscribing from export state",
  );
});

exportButton.addEventListener("click", () => {
  void errorGuard.safe(() => app.handleExport(), "Export handling");
});
