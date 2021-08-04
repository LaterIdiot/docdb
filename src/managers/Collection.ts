import { readdirSync, readFileSync, writeFileSync } from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { ObjectId } from '../structures/ObjectId.js';
import { Db } from './Db.js';

// TODO: put JSON types somewhere else and may need reevaluation
type JSONArray = Array<string | number | JSONObject | JSONArray | boolean | null>;

class JSONObject {
  [key: string]: string | number | JSONObject | JSONArray | boolean | null;
}

interface UnkownObject {
  [key: string]: any;
}

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

    const documentsPath = join(collectionPath, 'documents');
    const indexesPath = join(collectionPath, 'indexes');

    // ensures documentsPath is a directory
    mkdirp.sync(documentsPath);

    // ensures indexesPath is a directory
    mkdirp.sync(indexesPath);

    /**
     * Documents path
     * @type {string}
     */
    this.documentsPath = documentsPath;

    /**
     * Indexes path
     * @type {string}
     */
    this.indexesPath = indexesPath;
  }

  /**
   * Collection name pattern
   * @type {RegExp}
   * @static
   */
  static COLLECTION_NAME_PATTERN: RegExp = /^[^\/\\. "$*<>:|?]{1,255}$/;

  /**
   * Invalid collection name characters in a string
   * @type {string}
   * @static
   */
  static COLLECTION_NAME_INVALID_CHARS: string = '/\\. "$*<>:|?';

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

  /**
   * Documents path
   * @type {string}
   */
  public documentsPath: string;

  /**
   * Indexes path
   * @type {string}
   */
  public indexesPath: string;

  // TODO: parameter types for this method needs to be reevaluated
  /**
   * Inserts document to a collection.
   * @param {JSONObject} document - document to insert as object
   * @returns {Promise<void>}
   */
  public async insertOne(document: JSONObject & { _id?: string }): Promise<void> {
    if (document._id) {
      ObjectId.validateId(document._id);
    }

    const verifiedDocument = { _id: new ObjectId().str, ...document };
    const jsonDocument = JSON.stringify(verifiedDocument, null, 2);
    return writeFileSync(`${join(this.collectionPath, verifiedDocument._id + '.json')}`, jsonDocument);
  }

  // TODO: parameter types for this method needs to be reevaluated
  /**
   * Inserts multiple documents to a collection.
   * @param {JSONObject[]} document - Documents to insert as object array
   * @returns {Promise<void>}
   */
  public async insertMany(documentArr: (JSONObject & { _id?: string })[]): Promise<void> {
    for await (const document of documentArr) {
      this.insertOne(document);
    }
  }

  // TODO: parameter types for this method needs to be reevaluated
  // TODO: create JSDOC for this method
  private satisfiesQuery(query: JSONObject, document: JSONObject): boolean {
    const queryPropArr = Object.keys(query);

    for (const queryProp of queryPropArr) {
      if (queryProp in document) {
        if (typeof query[queryProp] === typeof document[queryProp]) {
          if (query[queryProp] === document[queryProp]) continue;
          else if (query[queryProp] instanceof Array && document[queryProp] instanceof Array) {
            query = { ...(query[queryProp] as object) };
            document = { ...(document[queryProp] as object) };
            if (!this.satisfiesQuery(query, document)) return false;
          } else if (query[queryProp] instanceof Object && document[queryProp] instanceof Object) {
            if (!this.satisfiesQuery(query, document)) return false;
          } else return false;
        }
      } else return false;
    }

    return true;
  }

  // TODO: parameter types for this method needs to be reevaluated
  // TODO: create JSDOC for this method
  public async findOne(query: JSONObject): Promise<void | JSONObject> {
    if (!(query instanceof Object)) {
      throw new TypeError('Argument of query must be a Object');
    }

    query = JSON.parse(JSON.stringify(query));
    const documentFileNameArr = readdirSync(this.collectionPath).filter(filename => filename.endsWith('.json'));

    for await (const documentFileName of documentFileNameArr) {
      const document: JSONObject = JSON.parse(readFileSync(join(this.collectionPath, documentFileName)).toString());
      if (this.satisfiesQuery(query, document)) return document;
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
