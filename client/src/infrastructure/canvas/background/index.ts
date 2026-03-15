import { ImageLoader } from "./loaders";

export class BackgroundCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement | null = null;
  private imageLoader: ImageLoader;
  private scale: number = 1;

  public constructor(canvas: HTMLCanvasElement, imageUrl: string) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D context is not available for the provided canvas.");
    }

    this.canvas = canvas;
    this.ctx = context;

    this.imageLoader = new ImageLoader(imageUrl);
  }

  public calculateScale(): number | null {
    if (
      !this.image ||
      this.image.naturalWidth === 0 ||
      this.image.naturalHeight === 0
    ) {
      return null;
    }

    const scaleX = this.canvas.width / this.image.naturalWidth;
    const scaleY = this.canvas.height / this.image.naturalHeight;
    this.scale = Math.max(scaleX, scaleY);
    return this.scale;
  }

  public getOriginalImageSize(): { width: number; height: number } | null {
    if (!this.image) {
      return null;
    }

    return {
      width: this.image.naturalWidth,
      height: this.image.naturalHeight,
    };
  }

  public setCanvasSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public async init(): Promise<void> {
    this.image = await this.imageLoader.load();
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderTo(this.ctx, this.scale);
  }

  public renderTo(ctx: CanvasRenderingContext2D, scale: number): void {
    if (!this.image) {
      throw new Error("Cannot render background: image is not loaded.");
    }

    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.naturalWidth * scale,
      this.image.naturalHeight * scale,
    );
  }
}
