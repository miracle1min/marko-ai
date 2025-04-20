declare module 'qrcode' {
  interface QRCodeOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    type?: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg' | 'svg';
    margin?: number;
    scale?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeOptions
  ): Promise<void>;

  function toDataURL(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;

  function toString(
    text: string,
    options?: QRCodeOptions,
    cb?: (err: any, string: string) => void
  ): void;

  function toString(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;

  export { toCanvas, toDataURL, toString };
  export default { toCanvas, toDataURL, toString };
}