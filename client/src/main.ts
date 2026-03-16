import "./shared/styles/global.css";
import elevatorImage from "./shared/assets/elevator.png";
import { BackgroundCanvas } from "./infrastructure/canvas/background";
import { DrawingCanvas } from "./infrastructure/canvas/drawing";
import type { Options } from "./infrastructure/canvas/drawing/types";
import { ErrorGuard } from "./infrastructure/error-boundary";
import App from "./application/app";
import { ExportService } from "./application/export/ExportService";
import { WindowLifecycleBinder } from "./presentation/windowLifecycleBinder";
import { OptionsControlPanel } from "./presentation/optionsControlPanel";
import { ExportControlsBinder } from "./presentation/exportBinder";

const errorGuard = new ErrorGuard();
errorGuard.init();

const backgroundCanvasElement = document.querySelector(
  "#app #background-canvas",
) as HTMLCanvasElement;
const drawingCanvasElement = document.querySelector("#app #drawing-canvas") as HTMLCanvasElement;

const exportButtonElement = document.querySelector("#export-button") as HTMLButtonElement;
const exportStatusElement = document.querySelector("#export-status") as HTMLParagraphElement;

const defaultOptions: Options = {
  cap: "round",
  width: 2,
  color: "#7e756d",
  brightness: 1,
};

// infrastructure
const backgroundCanvas = new BackgroundCanvas(backgroundCanvasElement, elevatorImage);
await backgroundCanvas.init();

const drawingCanvas = new DrawingCanvas(drawingCanvasElement, defaultOptions);
drawingCanvas.init();

// application
const exportService = new ExportService();
const app = new App({
  background: backgroundCanvas,
  drawing: drawingCanvas,
  exportService,
});

// presentation
const windowLifecycleBinder = new WindowLifecycleBinder(app);
windowLifecycleBinder.setPreloadedData();
windowLifecycleBinder.init();

const exportControlsBinder = new ExportControlsBinder(
  app,
  exportButtonElement,
  exportStatusElement,
);
exportControlsBinder.init();

const optionsControlPanel = new OptionsControlPanel(app, defaultOptions);
optionsControlPanel.init();
