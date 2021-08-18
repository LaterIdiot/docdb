import { Db } from './Db.js';
import { IndexSpecification, ProjectionObject, Document, Query } from '../tools/types';
export declare class Collection<DocumentSchema extends Document = Document> {
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
  /**
   * Indexes json file path
   * @type {string}
   */
  indexesJsonPath: string;
  /**
   * Inserts document to a collection.
   * @param {Document} document Document to insert as object
   * @returns {Promise<void>}
   */
  insertOne(document: DocumentSchema): Promise<void>;
  /**
   * Inserts multiple documents to a collection.
   * @param {Document[]} document Documents to insert as object array
   * @returns {Promise<void>}
   */
  insertMany(documentArr: DocumentSchema[]): Promise<void>;
  /**
   * Examines if the document given satisfies the query object (threshold).
   * @param {Document} query Qyery object used to check if it satisfies document
   * @param {Document} document The document to be checked
   * @returns {boolean}
   * @private
   */
  static satisfiesQuery(query: Document, document: Document): boolean;
  /**
   * Fetches the first document that matches the query object.
   * @param {Document} query Query object used to select a document
   * @returns {Promise<Document|void>}
   */
  findOne(query: Query<DocumentSchema>): Promise<DocumentSchema | void>;
  /**
   * Fetches all the documents that matches the query object as an array.
   * @param {Document} query Query object used to select a document
   * @returns {Promise<Document[]>}
   */
  find(query: Query<DocumentSchema>): Promise<DocumentSchema[]>;
  /**
   * Assigns the given document to the queried document.
   * @param {Document} query Query object used to select a document
   * @param {Document} document Document to assign
   * @returns {Promise<void>}
   */
  updateOne(query: Query<DocumentSchema>, document: Document): Promise<void>;
  /**
   * Deletes the queried document.
   * @param {Document} query Query object used to select a document
   * @returns {Promise<void>}
   */
  deleteOne(query: Query<DocumentSchema>): Promise<void>;
  /**
   * Examines if the document given satisfies the index specification.
   * @param {IndexSpecification} indexSpec Specification Object for an index
   * @param {Document} document Document to be checked
   * @returns {boolean}
   * @static
   */
  static satisfiesIndexSpec(indexSpec: IndexSpecification, document: Document): boolean;
  /**
   * Creates a projection of a given document depending on the defined projection object.
   * @param {Document} document Document to make projection of
   * @param {ProjectionObject} projectionObj Projection object that defines how to project a given document
   * @returns {Document}
   * @static
   */
  static createProjection(document: Document, projectionObj?: ProjectionObject): Document;
  /**
   * Indexes a given document.
   * @param {Document} document Document to index
   * @param {string} [indexJsonPath] Path of the index json file
   * @returns {Promise<void>}
   * @private
   */
  private indexOne;
  /**
   * Indexes the given documents.
   * @param {Document[]} document Documents to index
   * @param {string} [indexJsonPath] Path of the index json file
   * @returns {Promise<void>}
   * @private
   */
  private indexMany;
  /**
   * Creates a projection object from a index specification object.
   * @param {IndexSpecification} indexSpec Index specification object to create projection from
   * @returns {ProjectionObject}
   * @static
   */
  static createIndexProjectionObj(indexSpec: IndexSpecification): ProjectionObject;
  /**
   * Creates a new index using the given index specification object.
   * @param {IndexSpecification} indexSpec Index specification object that defines the index
   * @returns {Promise<void>}
   */
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
