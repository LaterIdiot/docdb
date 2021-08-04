import { writeFile, writeFileSync } from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { ObjectId } from '../structures/ObjectId.js';
import { Db } from './Db.js';

export class Collection {
  constructor(db: Db, collectionName: string) {
    this.validateDb(db);
    this.validateCollectionName(collectionName);

    const collectionPath = join(db.dbPath, collectionName);

    // ensures collectionPath is a directory
    mkdirp.sync(collectionPath);

    /**
     * Collection name
     * @type {string}
     */
    this.collectionName = collectionName;

    /**
     * Collection path
     * @type {string}
     */
    this.collectionPath = collectionPath;
  }

  /**
   * Collection name pattern
   * @type {RegExp}
   * @static
   */
  static COLLECTION_NAME_PATTERN = /^[^\/\\. "$*<>:|?]{1,255}$/;

  /**
   * Invalid collection name characters in a string
   * @type {string}
   * @static
   */
  static COLLECTION_NAME_INVALID_CHARS = '/\\. "$*<>:|?';

  /**
   * Collection name
   * @type {string}
   */
  public collectionName: string;

  /**
   * Collection path
   * @type {string}
   */
  public collectionPath: string;

  public async insertOne(document: object & { _id?: string }) {
    if (document._id) {
      ObjectId.validateId(document._id);
    }

    const verifiedDocument = { _id: new ObjectId().str, ...document };
    const jsonDocument = JSON.stringify(verifiedDocument, null, 2);
    return writeFileSync(`${join(this.collectionPath, verifiedDocument._id + '.json')}`, jsonDocument);
  }

  public async insertMany(documentArr: (object & { _id?: string })[]) {
    for await (const document of documentArr) {
      this.insertOne(document);
    }
  }

  /**
   * Validates argument of db.
   * @param {Db} Db - Instance of Db
   * @returns {void}
   * @throws {TypeError} Will throw an error if db is not an instance of Db.
   * @private
   */
  private validateDb(db: Db): void {
    if (typeof db !== 'object') throw new TypeError('Argument of db must be an object');
    if (!(db instanceof Db)) throw new TypeError('Argument of db must be an instance of Db');
  }

  /**
   * Validates argument of collectionName.
   * @param {string} collectionName - Valid collection name
   * @returns {void}
   * @throws {TypeError} Will throw an error if collectionName is not a valid collection name.
   * @private
   */
  private validateCollectionName(collectionName: string): void {
    if (typeof collectionName !== 'string') throw new TypeError('Argument of collectionName must be a string');
    if (collectionName.length <= 0) throw new TypeError('Argument of collectionName cannot be an empty string');
    if (collectionName.length > 255) throw new TypeError('Argument of collectionName must be fewer than 64 characters');
    if (!Collection.COLLECTION_NAME_PATTERN.test(collectionName))
      throw new TypeError(
        `Argument of collectionName cannot contain these characters: ${Collection.COLLECTION_NAME_INVALID_CHARS}`,
      );
  }
}
