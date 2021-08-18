/** A class representation of the BSON ObjectId type. */
export declare class ObjectId {
<<<<<<< HEAD:types/src/structures/ObjectId.d.ts
    /**
     * Create ObjectId
     * @param {string} [id] Hexadecimal string of ObjectId
     */
    constructor(id?: string);
    /**
     * ObjectId's index
     * @type {number}
     * @static
     */
    static index: number;
    /**
     * 5 byte random number for the current process
     * @type {Uint8Array}
     * @static
     */
    static processRandom5Bytes: Uint8Array;
    /**
     * ObjectId string pattern
     * @type {RegExp}
     * @static
     */
    static OBJECTID_PATTERN: RegExp;
    /**
     * ObjectId as buffer
     * @type {Buffer}
     * @private
     */
    private id;
    /**
     * ObjectId in hexadecimal string format
     * @type {string}
     * @readonly
     */
    get str(): string;
    /**
     * The timestamp portion of the ObjectId as a Date.
     * @returns {Date}
     */
    getTimestamp(): Date;
    /**
     * The string representation of the ObjectId. This string value has the format of ObjectId(...).
     * @returns {string}
     */
    toString(): string;
    /**
     * ObjectId id value in hexadecimal string.
     * @returns {string}
     */
    valueOf(): string;
    /**
     * Returns the id if it's valid otherwise it throws an error.
     * @param {string} id Hexadecimal string of ObjectId class
     * @returns {void}
     * @throws {TypeError} Throws an error if id is not a valid Object Id.
     * @private
     */
    static validateId(id: unknown): void;
    /**
     * Increments ObjectId's index.
     * @returns {number}
     * @private
     */
    private incrementIndex;
    /**
     * Generates a 12 byte unique ObjectId as buffer.
     * @returns {Buffer}
     * @private
     */
    private generate;
=======
  /**
   * Create ObjectId
   * @param {string} [id] Hexadecimal string of ObjectId
   */
  constructor(id?: string);
  /**
   * ObjectId index
   * @type {number}
   * @static
   */
  static index: number;
  /**
   * 5 byte random number for the current process
   * @type {Uint8Array}
   * @static
   */
  static processRandom5Bytes: Uint8Array;
  /**
   * Object Id pattern
   * @type {RegExp}
   * @static
   */
  static OBJECTID_PATTERN: RegExp;
  /**
   * Object Id as buffer
   * @type {Buffer}
   * @private
   */
  private id;
  /**
   * ObjectId in hexadecimal string format
   * @type {string}
   * @readonly
   */
  get str(): string;
  /**
   * The timestamp portion of the ObjectId as a Date.
   * @returns {Date}
   */
  getTimestamp(): Date;
  /**
   * The string representation of the ObjectId. This string value has the format of ObjectId(...)
   * @returns {string}
   */
  toString(): string;
  /**
   * ObjectId id value in hexadecimal string.
   * @returns {string}
   */
  valueOf(): string;
  /**
   * Returns the id if it's valid otherwise it throws an error.
   * @param {string} id - Hexadecimal string of ObjectId class
   * @returns {void}
   * @throws {TypeError} Throws an error if id is not a valid Object Id.
   * @private
   */
  static validateId(id: string): void;
  /**
   * Increments ObjectId index
   * @returns {number}
   * @private
   */
  private incrementIndex;
  /**
   * Generate a 12 byte unique ObjectId
   * @returns {Buffer}
   * @private
   */
  private generate;
>>>>>>> a4ae36663598168dfb21c8cf231a41d2f1cd74ac:types/structures/ObjectId.d.ts
}
