import { Buffer } from 'buffer';
import { randomBytes } from 'crypto';

/** A class representation of the BSON ObjectId type. */
export class ObjectId {
  /**
   * Create ObjectId
   * @param {string} [id] Hexadecimal string of ObjectId
   */
  constructor(id?: string) {
    if (id) {
      ObjectId.validateId(id);
      this.id = Buffer.from(id, 'hex');
      console.log(this.id);
    } else {
      this.id = this.generate();
    }
  }

  /**
   * ObjectId index
   * @type {number}
   * @static
   */
  static index: number = Math.random() * 0xffffff;

  /**
   * 5 byte random number for the current process
   * @type {Uint8Array}
   * @static
   */
  static processRandom5Bytes: Uint8Array = randomBytes(5);

  /**
   * Object Id pattern
   * @type {RegExp}
   * @static
   */
  static OBJECTID_PATTERN = /^(\d|[a-f]){24}$/;

  /**
   * Object Id as buffer
   * @type {Buffer}
   * @private
   */
  private id: Buffer;

  /**
   * ObjectId in hexadecimal string format
   * @type {string}
   * @readonly
   */
  public get str(): string {
    return this.id.toString('hex');
  }

  /**
   * The timestamp portion of the ObjectId as a Date.
   * @returns {Date}
   */
  public getTimestamp(): Date {
    const timestamp = new Date();
    const time = this.id.readUInt32BE(0);
    timestamp.setTime(time * 1000);
    return timestamp;
  }

  /**
   * The string representation of the ObjectId. This string value has the format of ObjectId(...)
   * @returns {string}
   */
  public toString(): string {
    return `${this.constructor.name}("${this.str}")`;
  }

  /**
   * ObjectId id value in hexadecimal string.
   * @returns {string}
   */
  public valueOf(): string {
    return this.str;
  }

  /**
   * Returns the id if it's valid otherwise it throws an error.
   * @param {string} id - Hexadecimal string of ObjectId class
   * @returns {void}
   * @throws {TypeError} Throws an error if id is not a valid Object Id.
   * @private
   */
  static validateId(id: string): void {
    if (typeof id !== 'string') throw new TypeError('Object id must be a string');
    if (id.length !== 24) throw new TypeError('Object id must be exactly 24 characters long hexadecimal string');
    if (!ObjectId.OBJECTID_PATTERN.test(id)) throw new TypeError('Object id must be a hexadecimal string');
  }

  /**
   * Increments ObjectId index
   * @returns {number}
   * @private
   */
  private incrementIndex(): number {
    return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
  }

  /**
   * Generate a 12 byte unique ObjectId
   * @returns {Buffer}
   * @private
   */
  private generate(): Buffer {
    const timestamp = ~~(Date.now() / 1000);
    const buffer = Buffer.alloc(12);
    const incrementedIndex = this.incrementIndex();

    // 4 byte timestamp
    buffer.writeUInt32BE(timestamp);

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
