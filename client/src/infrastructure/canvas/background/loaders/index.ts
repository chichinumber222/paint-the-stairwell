export class ImageLoader {
  private _src: string;
  private _image: HTMLImageElement;
  private _promise: Promise<HTMLImageElement> | null = null;

  constructor(src: string) {
    this._src = src;
    this._image = new Image();
  }

  public load(): Promise<HTMLImageElement> {
    if (this._promise) {
      return this._promise;
    }

    this._promise = new Promise((resolve, reject) => {
      this._image.onload = () => resolve(this._image);
      this._image.onerror = () =>
        reject(new Error(`Failed to load image: ${this._src}`));
      this._image.src = this._src;
    });

    return this._promise;
  }

  public isLoaded(): boolean {
    return this._image.complete;
  }
}
