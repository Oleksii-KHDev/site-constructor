declare module 'site-constructor/errors' {
  export type HttpErrorDetailsArray = [number?, string?, { code?: number; [key: string]: any }?];

  export interface HttpErrorDetailsObject {
    status?: number;
    message: string;
    meta?: { code?: number; [key: string]: any };
  }

  export interface IHttpDetailedError {
    validationMessage?: string;
    getMeta: (name: string) => any;
    setMeta: (name: string, value: any) => void;
  }
}
