
import * as http from 'http'

declare function Router():SimpleRouter

interface Obj {}

declare module Router {
    export interface Request extends http.ServerRequest {

    }
    export interface Response extends http.ServerResponse {
        answer(e:Error):void;
        answer(data:Buffer):void;
        answer(data:String):void;
        answer(data:Obj):void;
        answer(code:number, data:Buffer):void;
        answer(code:number, data:String):void;
        answer(code:number, data:Obj):void;
        answer(code:number, headers:Obj, data:Buffer):void;
        answer(code:number, headers:Obj, data:String):void;
        answer(code:number, headers:Obj, data:Obj):void;
    }

    export interface Handler {
        (req:Request, res?:Response, next?:(err?:Error) => void):any
    }

    export interface Route {}
}

interface SimpleRouter {
    get(path:string, ...handler:Router.Handler[]):void;
    post(path:string, ...handler:Router.Handler[]):void;
    put(path:string, ...handler:Router.Handler[]):void;
    head(path:string, ...handler:Router.Handler[]):void;
    delete(path:string, ...handler:Router.Handler[]):void;
    use(path:string, ...handler:Router.Handler[]):void;
    patch(path:string, ...handler:Router.Handler[]):void;
    all(path:string, ...handler:Router.Handler[]):void;
    propfind(path:string, ...handler:Router.Handler[]):void;
    proppatch(path:string, ...handler:Router.Handler[]):void;
    mkcol(path:string, ...handler:Router.Handler[]):void;
    copy(path:string, ...handler:Router.Handler[]):void;
    move(path:string, ...handler:Router.Handler[]):void;
    lock(path:string, ...handler:Router.Handler[]):void;
    unlock(path:string, ...handler:Router.Handler[]):void;
    options(path:string, ...handler:Router.Handler[]):void;
    route:Router.Route;
    server(): (req:http.IncomingMessage, res:http.ServerResponse) => void;
}

export = Router;
