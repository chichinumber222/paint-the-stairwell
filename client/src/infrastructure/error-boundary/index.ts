export class ErrorGuard {
  private initialized = false;

  private errorAlert(error: Error, locationDetails?: string): void {
    alert(`An error occurred${locationDetails ? `: ${locationDetails}` : ""}\n${error.message}`);
  }

  public async safe<T>(fn: () => Promise<T> | T, locationDetails: string): Promise<T | void> {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown");
      this.errorAlert(err, locationDetails);
    }
  }

  public init(): void {
    if (this.initialized) return;
    this.initialized = true;

    window.addEventListener("error", (event) => {
      const error = event.error instanceof Error ? event.error : new Error("Unknown");
      this.errorAlert(error, "Global error");
    });

    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error("Unknown");
      this.errorAlert(error, "Global unhandled promise rejection");
    });
  }
}
