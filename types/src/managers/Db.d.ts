import { OreoClient } from '../client/OreoClient.js';
import { Document } from '../tools/types.js';
import { Collection } from './Collection.js';
/**
 * Represents a OreoDB database
 */
export declare class Db {
  /**
   * Constructs an instance of Db.
   * @param {OreoClient} oreoClient Instance of OreoClient
   * @param {string} dbName Valid db name
   */
  constructor(oreoClient: OreoClient, dbName: string);
  /**
   * Database name pattern
   * @type {RegExp}
   * @static
   */
  static DB_NAME_PATTERN: RegExp;
  /**
   * Invalid database name characters in a string
   * @type {string}
   * @static
   */
  static DB_NAME_INVALID_CHARS: string;
  /**
   * Database name
   * @type {string}
   */
  dbName: string;
  /**
   * Database path
   * @type {string}
   */
  dbPath: string;
  /**
   * Access a collection if it does not exist then it will create one.
   * @param {string} collectionName A valid collection name
   * @returns {Collection}
   */
  collection<DocumentSchema extends Document = Document>(collectionName: string): Collection;
  /**
   * Validates argument of oreoClient.
   * @param {DocClient} oreoClient Instance of OreoClient
   * @returns {void}
   * @throws {TypeError} Will throw an error if oreoClient is not an instance of OreoClient.
   * @private
   */
  static validateOreoClient(oreoClient: OreoClient): void;
  /**
   * Validates argument of dbName.
   * @param {string} dbName Valid database name
   * @returns {void}
   * @throws {TypeError} Will throw an error if dbName is not a valid database name.
   * @private
   */
  static validateDbName(dbName: string): void;
}
