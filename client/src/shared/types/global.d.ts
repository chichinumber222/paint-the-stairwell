import { Path } from "../../application/types";

declare global {
  interface Window {
    __PRELOADED_STATE__?: {
      paths: Path[];
    };
  }
}
