import { ensureDirSync } from 'fs-extra';
import { join } from 'path';
import { OreoClient } from '../client/OreoClient.js';
import { Document } from '../tools/types.js';
import { Collection } from './Collection.js';

/**
 * Represents a OreoDB database
 */
export class Db {
  /**
   * Constructs an instance of Db.
   * @param {OreoClient} oreoClient Instance of OreoClient
   * @param {string} dbName Valid db name
   */
  constructor(oreoClient: OreoClient, dbName: string) {
    Db.validateOreoClient(oreoClient);
    Db.validateDbName(dbName);

    const dbPath = join(oreoClient.basePath, dbName);

    // ensures dbPath is a directory
    ensureDirSync(dbPath);

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
   * Access a collection if it does not exist then it will create one.
   * @param {string} collectionName A valid collection name
   * @returns {Collection}
   */
  public collection<DocumentSchema extends Document = Document>(collectionName: string): Collection {
    return new Collection<DocumentSchema>(this, collectionName);
  }

  /**
   * Validates argument of oreoClient.
   * @param {DocClient} oreoClient Instance of OreoClient
   * @returns {void}
   * @throws {TypeError} Will throw an error if oreoClient is not an instance of OreoClient.
   * @private
   */
  static validateOreoClient(oreoClient: OreoClient): void {
    if (typeof oreoClient !== 'object') throw new TypeError('Argument of oreoClient must be an object');
    if (!(oreoClient instanceof OreoClient))
      throw new TypeError('Argument of oreoClient must be an instance of OreoClient');
  }

  /**
   * Validates argument of dbName.
   * @param {string} dbName Valid database name
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
