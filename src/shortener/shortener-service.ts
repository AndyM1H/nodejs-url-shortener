import { Encoder } from "./encoder";
import { memoize } from "./in-memory-cache";

interface Shortener {
  shorten(url: string): string;
  getOriginal(short: string): string | undefined;
}

export class UrlShortenerService implements Shortener {
  private urlMap: Map<number, string>;

  constructor(
    private readonly baseUrl: string,
    private readonly encoder: Encoder
  ) {
    this.urlMap = new Map();
  }

  private shortenUrl(url: string): string {
    const id = this.encoder.getHashedDecimal(url);
    const shortUrlKey = this.encoder.encode(id);
    this.urlMap.set(id, url);

    return `${this.baseUrl}/url/${shortUrlKey}`;
  }

  public shorten(url: string): string {
    return memoize(this.shortenUrl.bind(this))(url);
  }

  public getOriginal(shortUrl: string): string | undefined {
    const shortUrlKey = shortUrl.replace(this.baseUrl, "");
    const id = this.encoder.decode(shortUrlKey);

    return this.urlMap.get(id);
  }
}
