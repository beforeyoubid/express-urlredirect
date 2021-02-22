// https://github.com/beforeyoubid/express-urlredirect
declare module 'express-urlredirect' {
  import * as Http from 'http';

  let modName: urlRedirect.urlredirect;
  namespace urlRedirect {
    interface urlredirect {
      (from: string, to?: string, statusCode?: number): expressUrlRedirectInstance;
    }

    interface expressUrlRedirectInstance {
      (req: Http.IncomingMessage, res: Http.ServerResponse, cb: () => any): void;
    }
  }
  export = modName;
}
