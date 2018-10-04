
declare module "simple-router" {
    function mkRouter(): SimpleRouter;

    import http = require("http");
    import express = require("express");

    interface Obj {}

    module mkRouter {
        export interface Request extends express.Request {

        }
        export interface Response extends express.Response {
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
        get(path:string, ...handler:mkRouter.Handler[]):void;
        post(path:string, ...handler:mkRouter.Handler[]):void;
        put(path:string, ...handler:mkRouter.Handler[]):void;
        head(path:string, ...handler:mkRouter.Handler[]):void;
        delete(path:string, ...handler:mkRouter.Handler[]):void;
        use(path:string, ...handler:mkRouter.Handler[]):void;
        patch(path:string, ...handler:mkRouter.Handler[]):void;
        all(path:string, ...handler:mkRouter.Handler[]):void;
        propfind(path:string, ...handler:mkRouter.Handler[]):void;
        proppatch(path:string, ...handler:mkRouter.Handler[]):void;
        mkcol(path:string, ...handler:mkRouter.Handler[]):void;
        copy(path:string, ...handler:mkRouter.Handler[]):void;
        move(path:string, ...handler:mkRouter.Handler[]):void;
        lock(path:string, ...handler:mkRouter.Handler[]):void;
        unlock(path:string, ...handler:mkRouter.Handler[]):void;
        options(path:string, ...handler:mkRouter.Handler[]):void;
        route:mkRouter.Route;
        server(): (req:http.IncomingMessage, res:http.ServerResponse) => void;
    }

    export = mkRouter;
}
