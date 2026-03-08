import "./styles/style.css";
import App from "./app/app";

const backgroundCanvas = document.querySelector(
  "#app #background-canvas",
) as HTMLCanvasElement;
const drawingCanvas = document.querySelector(
  "#app #drawing-canvas",
) as HTMLCanvasElement;

const app = new App(backgroundCanvas, drawingCanvas, {
  strokeStyle: "#7e756d",
  lineWidth: 2,
});

window.addEventListener("load", () => {
  app.init();
});

window.addEventListener("beforeunload", () => {
  app.destroy();
});
