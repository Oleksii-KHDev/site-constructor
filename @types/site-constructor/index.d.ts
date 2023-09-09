declare module 'site-constructor' {
  export type email = string;
  export type login = string;
  export type hostingUrl = string;

  export interface ICaptchaRecogniser {
    recogniseCaptchaText: (imagePath: string) => Promise<string>;
    initializeEnvironment: (options?: any) => Promise<void>;
    destroyEnvironment: () => Promise<void>;
  }
}
