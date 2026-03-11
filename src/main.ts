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

window.addEventListener("load", () => {
  void errorGuard.safe(() => app.init(), "App initialization");
});

window.addEventListener("beforeunload", () => {
  void errorGuard.safe(() => app.destroy(), "App destruction");
});

exportButton.addEventListener("click", () => {
  void errorGuard.safe(() => app.handleExport(), "Export handling");
});
