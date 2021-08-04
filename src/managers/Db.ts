import mkdirp from 'mkdirp';
import { join } from 'path';
import { DocClient } from '../client/DocClient.js';
import { Collection } from './Collection.js';

/**
 * Represents a DocDB database
 */
export class Db {
  /**
   * Constructs an instance of Db
   * @param {DocClient} docClient - Instance of DocClient
   * @param {string} dbName - Valid db name
   */
  constructor(docClient: DocClient, dbName: string) {
    Db.validateDocClient(docClient);
    Db.validateDbName(dbName);

    const dbPath = join(docClient.basePath, dbName);

    // ensures dbPath is a directory
    mkdirp.sync(dbPath);

    /**
     * Database name
     * @type {string}
     */
    this.dbName = dbName;

    /**
     * Database path
     * @type {string}
     */
    this.dbPath = dbPath;
  }

  /**
   * Database name pattern
   * @type {RegExp}
   * @static
   */
  static DB_NAME_PATTERN: RegExp = /^[^\/\\. "$*<>:|?]{1,63}$/;

  /**
   * Invalid database name characters in a string
   * @type {string}
   * @static
   */
  static DB_NAME_INVALID_CHARS: string = '/\\. "$*<>:|?';

  /**
   * Database name
   * @type {string}
   */
  public dbName: string;

  /**
   * Database path
   * @type {string}
   */
  public dbPath: string;

  /**
   * Access a collection if it does not exist it will create one
   * @param {string} collectionName - A valid collection name
   * @returns {Collection}
   */
  public collection(collectionName: string): Collection {
    return new Collection(this, collectionName);
  }

  /**
   * Validates argument of docClient,
   * @param {DocClient} docClient - Instance of DocClient
   * @returns {void}
   * @throws {TypeError} Will throw an error if docClient is not an instance of DocClient.
   * @private
   */
  static validateDocClient(docClient: DocClient): void {
    if (typeof docClient !== 'object') throw new TypeError('Argument of docClient must be an object');
    if (!(docClient instanceof DocClient))
      throw new TypeError('Argument of docClient must be an instance of DocClient');
  }

  /**
   * Validates argument of dbName.
   * @param {string} dbName - Valid database name
   * @returns {void}
   * @throws {TypeError} Will throw an error if dbName is not a valid database name.
   * @private
   */
  static validateDbName(dbName: string): void {
    if (typeof dbName !== 'string') throw new TypeError('Argument of dbName must be a string');
    if (dbName.length <= 0) throw new TypeError('Argument of dbName cannot be an empty string');
    if (dbName.length > 63) throw new TypeError('Argument of dbName must be fewer than 64 characters');
    if (!Db.DB_NAME_PATTERN.test(dbName))
      throw new TypeError(`Argument of dbName cannot contain these characters: ${Db.DB_NAME_INVALID_CHARS}`);
  }
}
