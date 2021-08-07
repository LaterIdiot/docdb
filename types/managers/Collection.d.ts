import { Db } from './Db.js';
import { JSONObject, IndexSpecification } from '../tools/types';
export declare class Collection {
    constructor(db: Db, collectionName: string);
    /**
     * Collection name pattern
     * @type {RegExp}
     * @static
     */
    static COLLECTION_NAME_PATTERN: RegExp;
    /**
     * Invalid collection name characters in a string
     * @type {string}
     * @static
     */
    static COLLECTION_NAME_INVALID_CHARS: string;
    /**
     * Collection name
     * @type {string}
     */
    collectionName: string;
    /**
     * Collection path
     * @type {string}
     */
    collectionPath: string;
    /**
     * Documents path
     * @type {string}
     */
    documentsPath: string;
    /**
     * Indexes path
     * @type {string}
     */
    indexesPath: string;
    indexesJsonPath: string;
    /**
     * Inserts document to a collection.
     * @param {JSONObject} document - document to insert as object
     * @returns {Promise<void>}
     */
    insertOne(document: JSONObject & {
        _id?: string;
    }): Promise<void>;
    /**
     * Inserts multiple documents to a collection.
     * @param {JSONObject[]} document - Documents to insert as object array
     * @returns {Promise<void>}
     */
    insertMany(documentArr: (JSONObject & {
        _id?: string;
    })[]): Promise<void>;
    private satisfiesQuery;
    findOne(query: JSONObject): Promise<void | JSONObject>;
    find(query: JSONObject): Promise<JSONObject[]>;
    createIndex(indexSpec: IndexSpecification): Promise<void>;
    /**
     * Validates argument of db.
     * @param {Db} Db - Instance of Db
     * @returns {void}
     * @throws {TypeError} Will throw an error if db is not an instance of Db.
     * @private
     */
    private validateDb;
    /**
     * Validates argument of collectionName.
     * @param {string} collectionName - Valid collection name
     * @returns {void}
     * @throws {TypeError} Will throw an error if collectionName is not a valid collection name.
     * @private
     */
    private validateCollectionName;
}
