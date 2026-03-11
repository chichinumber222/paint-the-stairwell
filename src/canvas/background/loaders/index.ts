export class ImageLoader {
  private _src: string;
  private _image: HTMLImageElement;
  private _promise: Promise<HTMLImageElement>;

  constructor(src: string) {
    this._src = src;
    this._image = new Image();
    this._promise = new Promise((resolve, reject) => {
      this._image.onload = () => resolve(this._image);
      this._image.onerror = () =>
        reject(new Error(`Failed to load image: ${this._src}`));
      this._image.src = this._src;
    });
  }

  public async getImage() {
    return this._promise;
  }

  public isLoaded() {
    return this._image.complete;
  }
}
