import { IncomingMessage, ServerResponse } from "node:http";
import { UrlShortenerService } from "../shortener/shortener-service";
import { validateUrl } from "../utils/utils";
import { BadRequestException, NotFoundException } from "../errors/exception";
import HttpStatusCodes from "../errors/status-codes";
import { HttpErrorHandler } from "../errors/handler";
import { ROUTES } from "../routes";
import { Controller, RouteHandler } from "./api-controller";

type BodyDTO = {
  url: string;
};

export class UrlShortenerController implements Controller {
  private readonly routeHandlers = new Map<string, RouteHandler>();

  constructor(private readonly urlShortener: UrlShortenerService) {
    this.routeHandlers.set(ROUTES.SHORT, {
      method: "POST",
      handler: this.handleShorten.bind(this),
    });

    this.routeHandlers.set(ROUTES.GET_URL, {
      method: "GET",
      handler: this.handleRetrieve.bind(this),
    });
  }

  public getRouteHandlers() {
    return this.routeHandlers;
  }

  public handleShorten(req: IncomingMessage, res: ServerResponse) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedBody = JSON.parse(body) as BodyDTO;
      const url = parsedBody.url;
      console.log(url);
      try {
        if (!validateUrl(url)) {
          throw new BadRequestException("Invalid URL");
        }

        const shortUrl = this.shortenUrl(parsedBody.url);
        res.writeHead(HttpStatusCodes.CREATED, {
          "Content-Type": "text/plain",
        });
        res.end(shortUrl);
      } catch (error: unknown) {
        HttpErrorHandler.handle(res, error);
      }
    });

    req.on("error", (_error) => {
      res.writeHead(HttpStatusCodes.INTERNAL_SERVER_ERROR, {
        "Content-Type": "text/plain",
      });
      res.end("Internal Server Error");
    });
  }

  public handleRetrieve(req: IncomingMessage, res: ServerResponse) {
    const paramIndex = ROUTES.GET_URL.toString()
      .split("/")
      .findIndex((path: string) => path.startsWith(":"));
    const urlParam = req.url?.split("/")[paramIndex];

    if (urlParam) {
      try {
        const originalUrl = this.retrieveUrl(urlParam);
        const encodedUrl = encodeURI(originalUrl);

        res.writeHead(HttpStatusCodes.FOUND, { Location: encodedUrl });
        res.end();
      } catch (error: unknown) {
        HttpErrorHandler.handle(res, error);
      }
    } else {
      res.writeHead(HttpStatusCodes.BAD_REQUEST, {
        "Content-Type": "text/plain",
      });
      res.end("Invalid request");
    }
  }

  private shortenUrl(url: string): string {
    return this.urlShortener.shorten(url);
  }

  private retrieveUrl(shortUrl: string): string {
    const originalUrl = this.urlShortener.getOriginal(shortUrl);

    if (!originalUrl) {
      throw new NotFoundException("Provided URL couldn't be found");
    }

    return originalUrl;
  }
}
