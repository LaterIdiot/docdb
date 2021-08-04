import mkdirp from 'mkdirp';
import { Db } from '../managers/Db.js';

/**
 * The base client for DocDB
 */
export class DocClient {
  /**
   * Creates a client for DocDB and initialises a folder.
   * @param {string} basePath - The basepath for DocClient to store data in
   */
  constructor(basePath: string) {
    // ensures that the directory exists and makes basePath valid if not already
    mkdirp.sync(basePath);

    /**
     * Base path of DocClient or path of the folder where all the databases will be stored
     * @type {string}
     */
    this.basePath = basePath;
  }

  /**
   * Base path of DocClient or path of the folder where all the databases will be stored
   * @type {string}
   */
  public basePath: string;

  /**
   * Access a database if it does not exist it will create one
   * @param {string} dbName - A valid database name
   * @returns {Db}
   */
  public db(dbName: string): Db {
    return new Db(this, dbName);
  }
}
