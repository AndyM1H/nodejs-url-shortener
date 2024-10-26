import { ApiController, Controller } from "./controllers/api-controller";
import { UrlShortenerController } from "./controllers/shortener-controller";
import { Encoder } from "./shortener/encoder";
import { UrlShortenerService } from "./shortener/shortener-service";

export class App {
  private urlShortener: UrlShortenerService;
  private encoder: Encoder;
  private apiController: ApiController;
  private controllers: Controller[];

  constructor() {
    this.encoder = new Encoder();
    this.urlShortener = new UrlShortenerService(
      process.env.BASE_URL || "",
      this.encoder
    );

    this.controllers = [];
    this.controllers.push(new UrlShortenerController(this.urlShortener));

    this.apiController = new ApiController(this.controllers);
  }

  get ApiController(): ApiController {
    return this.apiController;
  }
}
