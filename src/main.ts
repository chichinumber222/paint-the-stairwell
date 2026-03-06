import "./style.css";
import App from "./app";

const canvas = document.querySelector("#app #canvas") as HTMLCanvasElement;

const app = new App(canvas);

window.addEventListener("load", () => {
  app.init();
});

window.addEventListener("beforeunload", () => {
  app.destroy();
});
