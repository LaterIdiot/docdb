import { Db } from '../managers/Db.js';
/**
 * The base client for DocDB
 */
export declare class DocClient {
  /**
   * Creates a client for DocDB and initialises a folder.
   * @param {string} basePath The basepath for DocClient to store data in
   */
  constructor(basePath: string);
  /**
   * Base path of DocClient or path of the folder where all the databases will be stored
   * @type {string}
   */
  basePath: string;
  /**
   * Access a database, if it does not exist it will create one.
   * @param {string} dbName A valid database name
   * @returns {Db}
   */
  db(dbName: string): Db;
}
