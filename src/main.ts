import "./styles/style.css";
import App from "./app/Index";

const backgroundCanvas = document.querySelector(
  "#app #background-canvas",
) as HTMLCanvasElement;
const drawingCanvas = document.querySelector(
  "#app #drawing-canvas",
) as HTMLCanvasElement;

const app = new App(backgroundCanvas, drawingCanvas);

window.addEventListener("load", () => {
  app.init();
});

window.addEventListener("beforeunload", () => {
  app.destroy();
});
