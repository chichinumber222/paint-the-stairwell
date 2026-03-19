import type App from "../../application/app";

export class WindowLifecycle {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  public setPreloadedData(): void {
    const data = window.__PRELOADED_STATE__;
    if (!data || !data.paths) return;
    this.app.setInitialData(data.paths);
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
