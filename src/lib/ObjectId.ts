import { Buffer } from 'buffer';
import { randomBytes } from 'crypto';

/**
 * A class representation of the BSON ObjectId type
 * @public
 */
export class ObjectId {
  /** ObjectId index @static */
  static index = Math.random() * 0xffffff;

  /** 5 byte random number for the current process @static */
  static processRandom5Bytes: Uint8Array = randomBytes(5);

  /** ObjectId in hexadecimal string format @private @readonly */
  private readonly $oid: string;

  constructor() {
    this.$oid = this.generate().toString('hex');
  }

  /**
   * /** ObjectId in hexadecimal string format
   * @returns {string}
   * @public
   */
  public get str(): string {
    return this.$oid;
  }

  public getTimestamp(): Date {
    return new Date(parseInt(this.$oid.substring(0, 8), 10));
  }

  public toString(): string {
    return `${this.constructor.name}("${this.str}")`;
  }

  public valueOf(): string {
    return this.str;
  }

  /**
   * Increments ObjectId index
   * @returns {number}
   * @private
   */
  private incrementIndex() {
    return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
  }

  /**
   * Generate a 12 byte unique ObjectId
   * @returns {Buffer}
   * @private
   */
  private generate() {
    const timestamp = ~~(Date.now() / 1000);
    const buffer = Buffer.alloc(12);
    const incrementedIndex = this.incrementIndex();

    // 4 byte timestamp
    buffer.writeInt32BE(timestamp);

    // 5 byte random value from the current process
    buffer[4] = ObjectId.processRandom5Bytes[0];
    buffer[5] = ObjectId.processRandom5Bytes[1];
    buffer[6] = ObjectId.processRandom5Bytes[2];
    buffer[7] = ObjectId.processRandom5Bytes[3];
    buffer[8] = ObjectId.processRandom5Bytes[4];

    // 3 byte incrementing counter
    buffer[9] = (incrementedIndex >> 16) & 0xff;
    buffer[10] = (incrementedIndex >> 8) & 0xff;
    buffer[11] = incrementedIndex & 0xff;

    return buffer;
  }
}
