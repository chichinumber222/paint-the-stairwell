import "./styles/style.css";
import App from "./app/Index";
import backgroundImageUrl from "./assets/elevator.png";

const backgroundCanvas = document.querySelector(
  "#app #background-canvas",
) as HTMLCanvasElement;
const drawingCanvas = document.querySelector(
  "#app #drawing-canvas",
) as HTMLCanvasElement;

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
  app.init();
});

window.addEventListener("beforeunload", () => {
  app.destroy();
});

const exportButton = document.querySelector(
  "#export-button",
) as HTMLButtonElement;

exportButton.addEventListener("click", () => {
  app.handleExport();
});
