export class BackgroundCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private getScale: () => number | null;

  public constructor(
    canvas: HTMLCanvasElement,
    imageUrl: string,
    getScale: () => number | null,
    onReady?: () => void,
  ) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D context is not available for the provided canvas.");
    }

    this.canvas = canvas;
    this.ctx = context;
    this.getScale = getScale;

    this.image = new Image();
    this.image.addEventListener("load", () => {
      onReady?.();
    });
    this.image.src = imageUrl;
  }

  public calculateScale(): number | null {
    if (
      !this.image.complete ||
      this.image.naturalWidth === 0 ||
      this.image.naturalHeight === 0
    ) {
      return null;
    }

    if (this.canvas.width === 0 || this.canvas.height === 0) {
      return null;
    }

    const scaleX = this.canvas.width / this.image.naturalWidth;
    const scaleY = this.canvas.height / this.image.naturalHeight;
    return Math.max(scaleX, scaleY);
  }

  public setCanvasSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const scale = this.getScale();

    if (!this.image.complete || !scale) {
      return;
    }

    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.naturalWidth * scale,
      this.image.naturalHeight * scale,
    );
  }
}
