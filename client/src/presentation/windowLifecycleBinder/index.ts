import type App from "../../application/app";

export class WindowLifecycleBinder {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  public init(): () => void {
    const renderApp = () => this.app.syncAndRender();
    window.addEventListener("load", renderApp);
    window.addEventListener("resize", renderApp);
    return () => {
      window.removeEventListener("load", renderApp);
      window.removeEventListener("resize", renderApp);
    };
  }
}
