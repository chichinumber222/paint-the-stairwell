import type App from "../../application/app";

export class Controls {
  private app: App;
  private undoButtonElement: HTMLButtonElement;
  private deleteButtonElement: HTMLButtonElement;

  constructor(
    app: App,
    undoButtonElement: HTMLButtonElement,
    deleteButtonElement: HTMLButtonElement,
  ) {
    this.app = app;
    this.undoButtonElement = undoButtonElement;
    this.deleteButtonElement = deleteButtonElement;
  }

  public init(): () => void {
    const onClickUndo = () => {
      this.app.undoControl();
      this.app.syncAndRender();
    };
    const onClickDelete = () => {
      this.app.deleteControl();
      this.app.syncAndRender();
    };

    this.undoButtonElement.addEventListener("click", onClickUndo);
    this.deleteButtonElement.addEventListener("click", onClickDelete);

    return () => {
      this.undoButtonElement.removeEventListener("click", onClickUndo);
      this.deleteButtonElement.removeEventListener("click", onClickDelete);
    };
  }
}
