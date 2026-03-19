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
    const onClickUndo = () => this.app.handleUndo();
    const onClickDelete = () => this.app.handleDeleteAll();

    this.undoButtonElement.addEventListener("click", onClickUndo);
    this.deleteButtonElement.addEventListener("click", onClickDelete);

    return () => {
      this.undoButtonElement.removeEventListener("click", onClickUndo);
      this.deleteButtonElement.removeEventListener("click", onClickDelete);
    };
  }
}
