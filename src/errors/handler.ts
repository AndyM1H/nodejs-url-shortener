import { ServerResponse } from "http";
import { BaseHttpException } from "./exception";
import HttpStatusCodes from "./status-codes";

export class HttpErrorHandler {
  public static handle(res: ServerResponse, error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("An error occured:", errorMessage);

    const statusCode =
      error instanceof BaseHttpException
        ? error.status
        : HttpStatusCodes.INTERNAL_SERVER_ERROR;

    res.writeHead(statusCode, { "Content-Type": "text/plain" });
    res.end(errorMessage);
  }
}
