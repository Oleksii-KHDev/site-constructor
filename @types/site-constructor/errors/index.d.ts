declare module 'site-constructor/errors' {
  export type HttpErrorDetailsArray = [statusCode: number, message: string, { errorCode: number; [key: string]: any }];

  export interface HttpErrorDetailsObject {
    statusCode?: number;
    message: string;
    meta: { errorCode: number; [key: string]: any };
  }

  export interface IHttpDetailedError {
    validationMessage?: string;
    [key: string]: any;
    getMeta: (name: string) => any;
    setMeta: (name: string, value: any) => void;
  }
}
