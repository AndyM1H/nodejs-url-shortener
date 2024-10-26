import { IncomingMessage, ServerResponse } from "node:http";
import HttpStatusCodes from "../errors/status-codes";
import { HttpErrorHandler } from "../errors/handler";

export interface Controller {
  getRouteHandlers(): Map<string, RouteHandler>;
}

export type RouteHandler = {
  method: string;
  handler: (req: IncomingMessage, res: ServerResponse) => void;
};

export class ApiController {
  private readonly routeHandlers: Map<string, RouteHandler> = new Map();

  constructor(controllers: Controller[]) {
    this.registerControllers(controllers);
  }

  private registerControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      const handlers = controller.getRouteHandlers();
      handlers.forEach((handler, route) => {
        this.routeHandlers.set(route, handler);
      });
    });
  }

  public handle(req: IncomingMessage, res: ServerResponse) {
    try {
      const url = req.url ?? "";
      const method = req.method ?? "";

      console.log(`Received ${method} request to ${url}`);

      const [route] = url.split("?");
      const handler = this.getHandler(route, method);

      if (!handler) {
        res.writeHead(HttpStatusCodes.NOT_FOUND, {
          "Content-Type": "text/plain",
        });
        res.end("Resource not found");
        return;
      }

      handler(req, res);
    } catch (error: unknown) {
      HttpErrorHandler.handle(res, error);
    }
  }

  // private getHandler(url: string, method: string) {
  //   const routeHandler = this.routeHandlers.get(url);
  //   console.log(url);
  //   if (routeHandler && routeHandler.method === method) {
  //     return routeHandler.handler;
  //   }

  //   return null;
  // }

  private getHandler(url: string, method: string) {
    const exactMatch = this.routeHandlers.get(url);
    if (exactMatch && exactMatch.method === method) {
      return exactMatch.handler;
    }

    for (const [route, { method: routeMethod, handler }] of this
      .routeHandlers) {
      const routeRegex = new RegExp(`^${route.replace(/:[^\s/]+/, "[^/]+")}$`);
      if (routeRegex.test(url) && routeMethod === method) {
        return handler;
      }
    }

    return null;
  }
}
