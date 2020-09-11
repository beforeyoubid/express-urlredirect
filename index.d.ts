// https://github.com/beforeyoubid/express-urlredirect
declare module "express-urlredirect" {
    import * as Http from "http";

    let modName: urlRedirect.urlredirect;
    module urlRedirect {

        interface urlredirect {
            (from: string, to?: string, statusCode?: number): expressUrlRewriteInstance
        }

        interface expressUrlRedirectInstance {
            (req: Http.IncomingMessage, res: Http.ServerResponse, cb: () => any): void
        }
    }
    export = modName;
}
