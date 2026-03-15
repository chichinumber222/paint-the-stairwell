import type { App } from "../../application/app";
import GUI from "lil-gui";
import type { Options } from "../../application/types";

export class OptionsControlPanel {
  private app: App;
  private gui: GUI | null = null;
  private options: Options = {};

  constructor(app: App, options: Options) {
    this.app = app;
    this.options = { ...options };
  }

  public init(): void {
    this.gui = new GUI();
    this.gui
      .addColor(this.options, "color")
      .onChange((value: string) =>
        this.app.setOptions({ color: value }),
      );
    this.gui
      .add(this.options, "width", 1, 20)
      .onChange((value: number) =>
        this.app.setOptions({ width: value }),
      );
    this.gui
      .add(this.options, "brightness", 0, 1)
      .onChange((value: number) =>
        this.app.setOptions({ brightness: value }),
      );
    this.gui
      .add(this.options, "cap", ["butt", "round", "square"])
      .onChange((value: "butt" | "round" | "square") =>
        this.app.setOptions({ cap: value }),
      );
  }

  public destroy(): void {
    this.gui?.destroy();
    this.gui = null;
  }
}
