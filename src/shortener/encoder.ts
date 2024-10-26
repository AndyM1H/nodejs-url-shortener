import crypto from "node:crypto";
interface IEncoder {
  encode(num: number): string;
  decode(str: string): number;
}

export class Encoder implements IEncoder {
  private readonly chars: string;
  private readonly length: number;
  private readonly base: number;

  constructor() {
    this.chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    this.base = this.chars.length;
    this.length = 4;
  }

  public getHashedDecimal(data: string): number {
    return parseInt(
      Buffer.from(
        crypto
          .createHash("md5")
          .update(data)
          .digest("hex")
          .substring(0, this.length)
      ).toString("hex")
    );
  }

  public encode(num: number): string {
    let encoded = "";
    while (num > 0) {
      encoded = this.chars[num % this.base] + encoded;
      num = Math.floor(num / this.base);
    }

    return encoded || this.chars[0].repeat(this.length);
  }

  public decode(str: string): number {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
      num = num * this.base + this.chars.indexOf(str[i]);
    }
    return num;
  }
}
