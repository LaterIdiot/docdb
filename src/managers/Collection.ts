import fse, { readJsonSync, removeSync } from 'fs-extra';
const { ensureDirSync, readdirSync, readFileSync, unlinkSync, writeFileSync, writeJsonSync, pathExistsSync } = fse;

import { join } from 'path';
import { ObjectId } from '../structures/ObjectId.js';
import { Db } from './Db.js';
import {
  JSONObject,
  IndexSpecification,
  IndexesObject,
  IndexedDocumentsObject,
  ProjectionObject,
  UnknownObject,
  IndexObject,
  Document,
  Query,
} from '../tools/types';
import { isObject, deepEqual, isObjectOnly } from '../tools/functions.js';

export class Collection<DocumentSchema extends Document = Document> {
  constructor(db: Db, collectionName: string) {
    this.validateDb(db);
    this.validateCollectionName(collectionName);

    const collectionPath = join(db.dbPath, collectionName);

    // ensures collectionPath is a directory
    ensureDirSync(collectionPath);

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
    ensureDirSync(documentsPath);

    // ensures indexesPath is a directory
    ensureDirSync(indexesPath);

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

    const indexesJsonPath = join(indexesPath, 'indexes.json');

    if (!pathExistsSync(indexesJsonPath)) {
      const indexesDefault: IndexesObject = { indexes: [] };
      writeJsonSync(indexesJsonPath, indexesDefault, { spaces: 2 });
    }

    /**
     * Indexes json file path
     * @type {string}
     */
    this.indexesJsonPath = indexesJsonPath;
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

  /**
   * Indexes json file path
   * @type {string}
   */
  public indexesJsonPath: string;

  /**
   * Inserts document to a collection.
   * @param {Document} document Document to insert as object
   * @returns {Promise<void>}
   */
  public async insertOne(document: DocumentSchema): Promise<void> {
    if (!isObjectOnly(document)) throw new TypeError('Argument of document must be an object');

    if ('_id' in document) {
      delete document['_id'];
    }

    const verifiedDocument = { _id: new ObjectId().str, ...document };
    writeJsonSync(join(this.documentsPath, verifiedDocument._id + '.json'), verifiedDocument, { spaces: 2 });
    // await this.indexOne(document);
  }

  /**
   * Inserts multiple documents to a collection.
   * @param {Document[]} document Documents to insert as object array
   * @returns {Promise<void>}
   */
  public async insertMany(documentArr: DocumentSchema[]): Promise<void> {
    if (!Array.isArray(documentArr)) throw new TypeError('Argument of documentArr must be an array');

    for await (const document of documentArr) {
      this.insertOne(document);
    }

    // await this.indexMany(documentArr);
  }

  /**
   * Examines if the document given satisfies the query object (threshold).
   * @param {Document} query Qyery object used to check if it satisfies document
   * @param {Document} document The document to be checked
   * @returns {boolean}
   * @private
   */
  static satisfiesQuery(query: Document, document: Document): boolean {
    const queryPropArr = Object.keys(query);

    for (const queryProp of queryPropArr) {
      const val1 = query[queryProp];
      const val2 = document[queryProp];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        (areObjects && !Collection.satisfiesQuery(val1 as JSONObject, val2 as JSONObject)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Fetches the first document that matches the query object.
   * @param {Document} query Query object used to select a document
   * @returns {Promise<Document|void>}
   */
  public async findOne(query: Query<DocumentSchema>): Promise<DocumentSchema | void> {
    if (!isObjectOnly(query)) throw new TypeError('Argument of query must be a Object');

    if ('_id' in query) {
      try {
        ObjectId.validateId(query._id);
        const jsonFilePath = join(this.documentsPath, `${query._id}.json`);

        if (!pathExistsSync(jsonFilePath)) return;

        return readJsonSync(jsonFilePath);
      } catch {
        return;
      }
    }

    // this is done to get rid of all methods if there are any
    query = JSON.parse(JSON.stringify(query));
    const documentFileNameArr = readdirSync(this.documentsPath).filter(filename => filename.endsWith('.json'));

    for await (const documentFileName of documentFileNameArr) {
      const document: DocumentSchema = readJsonSync(join(this.documentsPath, documentFileName));
      if (Collection.satisfiesQuery(query as Document, document)) return document;
    }
  }

  /**
   * Fetches all the documents that matches the query object as an array.
   * @param {Document} query Query object used to select a document
   * @returns {Promise<Document[]>}
   */
  public async find(query: Query<DocumentSchema>): Promise<DocumentSchema[]> {
    if (!isObjectOnly(query)) throw new TypeError('Argument of query must be a Object');

    if ('_id' in query) {
      try {
        ObjectId.validateId(query._id);
        const jsonFilePath = join(this.documentsPath, `${query._id}.json`);

        if (!pathExistsSync(jsonFilePath)) return [];

        return [readJsonSync(jsonFilePath)];
      } catch {
        return [];
      }
    }

    query = JSON.parse(JSON.stringify(query));
    const documentFileNameArr = readdirSync(this.documentsPath).filter(filename => filename.endsWith('.json'));

    const filteredDocumentArr: DocumentSchema[] = [];

    for await (const documentFileName of documentFileNameArr) {
      const document: DocumentSchema = readJsonSync(join(this.documentsPath, documentFileName));
      if (Collection.satisfiesQuery(query as Document, document)) filteredDocumentArr.push(document);
    }

    return filteredDocumentArr;
  }

  /**
   * Assigns the given document to the queried document.
   * @param {Document} query Query object used to select a document
   * @param {Document} document Document to assign
   * @returns {Promise<void>}
   */
  public async updateOne(query: Query<DocumentSchema>, document: Document): Promise<void> {
    if (!isObjectOnly(document)) throw new TypeError('Argument of document must be a Object');

    const oldDocument = await this.findOne(query);

    if (!oldDocument) return;

    const { _id, ...updateDocument } = document;
    const newDocument = { ...oldDocument, ...updateDocument };

    writeJsonSync(join(this.documentsPath, `${newDocument._id}.json`), newDocument, { spaces: 2 });
  }

  /**
   * Deletes the queried document.
   * @param {Document} query Query object used to select a document
   * @returns {Promise<void>}
   */
  public async deleteOne(query: Query<DocumentSchema>): Promise<void> {
    const document = await this.findOne(query);

    if (!document) return;

    removeSync(join(this.documentsPath, `${document._id}.json`));
  }

  /**
   * Examines if the document given satisfies the index specification.
   * @param {IndexSpecification} indexSpec Specification Object for an index
   * @param {Document} document Document to be checked
   * @returns {boolean}
   * @static
   */
  static satisfiesIndexSpec(indexSpec: IndexSpecification, document: Document): boolean {
    const indexSpecPropArr = Object.keys(indexSpec);
    const documentPropArr = Object.keys(document);

    for (const indexSpecProp of indexSpecPropArr) {
      if (!documentPropArr.includes(indexSpecProp)) return false;

      const val1 = indexSpec[indexSpecProp];
      const val2 = document[indexSpecProp];
      const areObjects = isObject(val1 as IndexSpecification) && isObject(val2 as JSONObject);

      if (
        (areObjects && !Collection.satisfiesIndexSpec(val1 as IndexSpecification, val2 as JSONObject)) ||
        (!areObjects && isObject(val1) !== isObject(val2))
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Creates a projection of a given document depending on the defined projection object.
   * @param {Document} document Document to make projection of
   * @param {ProjectionObject} projectionObj Projection object that defines how to project a given document
   * @returns {Document}
   * @static
   */
  static createProjection(document: Document, projectionObj?: ProjectionObject): Document {
    if (projectionObj === undefined) return document;

    const documentPropArr = Object.keys(document);
    const projectionObjPropArr = Object.keys(projectionObj);
    const projectedDocument: JSONObject = {};

    for (const projectionObjProp of projectionObjPropArr) {
      const projectionObjPropVal = projectionObj[projectionObjProp];
      const documentPropVal = document[projectionObjProp];
      const projectionObjPropValIsObj = isObject(projectionObjPropVal);
      const documentPropValIsObj = isObject(documentPropVal);

      if (projectionObjPropValIsObj) {
        if (documentPropValIsObj) {
          projectedDocument[projectionObjProp] = Collection.createProjection(
            documentPropVal as JSONObject,
            projectionObjPropVal as ProjectionObject,
          );
        } else {
          projectedDocument[projectionObjProp] = documentPropVal;
        }
      } else {
        if (projectionObjPropVal === 1) {
          projectedDocument[projectionObjProp] = documentPropVal;
        }
      }
    }

    return projectedDocument;
  }

  /**
   * Indexes a given document.
   * @param {Document} document Document to index
   * @param {string} [indexJsonPath] Path of the index json file
   * @returns {Promise<void>}
   * @private
   */
  private async indexOne(document: Document, indexJsonPath?: string): Promise<void> {
    if (!indexJsonPath) {
      const indexesObj: IndexesObject = readJsonSync(this.indexesJsonPath);

      for await (const index of indexesObj.indexes) {
        const indexJsonPath = join(this.indexesPath, index.jsonFileName);
        this.indexOne(document, indexJsonPath);
      }

      return;
    }

    const indexedDocumentsObj: IndexedDocumentsObject = JSON.parse(readFileSync(indexJsonPath).toString());

    if (!Collection.satisfiesIndexSpec(indexedDocumentsObj.indexSpecification, document)) return;

    const projectedDocument = Collection.createProjection(document, indexedDocumentsObj.indexProjection);
    indexedDocumentsObj.indexedDocuments.push({ indexedDocument: projectedDocument, _id: document._id as string });

    return writeJsonSync(indexJsonPath, indexedDocumentsObj, { spaces: 2 });
  }

  /**
   * Indexes the given documents.
   * @param {Document[]} document Documents to index
   * @param {string} [indexJsonPath] Path of the index json file
   * @returns {Promise<void>}
   * @private
   */
  private async indexMany(documentArr: Document[], indexJsonPath?: string): Promise<void> {
    if (!indexJsonPath) {
      const indexesObj: IndexesObject = readJsonSync(this.indexesJsonPath);

      for await (const index of indexesObj.indexes) {
        const indexJsonPath = join(this.indexesPath, index.jsonFileName);
        this.indexMany(documentArr, indexJsonPath);
      }

      return;
    }

    const indexedDocumentsObj: IndexedDocumentsObject = JSON.parse(readFileSync(indexJsonPath).toString());

    for (const document of documentArr) {
      if (!Collection.satisfiesIndexSpec(indexedDocumentsObj.indexSpecification, document)) continue;

      const projectedDocument = Collection.createProjection(document, indexedDocumentsObj.indexProjection);
      indexedDocumentsObj.indexedDocuments.push({ indexedDocument: projectedDocument, _id: document._id as string });
    }

    return writeJsonSync(indexJsonPath, indexedDocumentsObj, { spaces: 2 });
  }

  /**
   * Creates a projection object from a index specification object.
   * @param {IndexSpecification} indexSpec Index specification object to create projection from
   * @returns {ProjectionObject}
   * @static
   */
  static createIndexProjectionObj(indexSpec: IndexSpecification): ProjectionObject {
    const indexSpecPropArr = Object.keys(indexSpec);
    const projectionObj: ProjectionObject = {};

    for (const indexSpecProp of indexSpecPropArr) {
      const val = indexSpec[indexSpecProp];

      if (isObject(val)) {
        projectionObj[indexSpecProp] = Collection.createIndexProjectionObj(val as IndexSpecification);
      } else {
        projectionObj[indexSpecProp] = 1;
      }
    }

    return projectionObj;
  }

  /**
   * Creates a new index using the given index specification object.
   * @param {IndexSpecification} indexSpec Index specification object that defines the index
   * @returns {Promise<void>}
   */
  public async createIndex(indexSpec: IndexSpecification): Promise<void> {
    if (!isObjectOnly(indexSpec)) throw new TypeError('Argument of indexSpec must be an object');

    const indexesObj: IndexesObject = readJsonSync(this.indexesJsonPath);

    for (const index of indexesObj.indexes) {
      if (deepEqual(index, indexSpec)) return;
    }

    const indexObj: IndexObject = {
      indexSpecification: indexSpec,
      jsonFileName: `index-${indexesObj.indexes.length}.json`,
    };

    indexesObj.indexes.push(indexObj);

    writeJsonSync(this.indexesJsonPath, indexesObj, { spaces: 2 });

    const indexJsonPath = join(this.indexesPath, indexObj.jsonFileName);

    if (!pathExistsSync(indexJsonPath)) {
      const indexDefault: IndexedDocumentsObject = {
        indexSpecification: indexSpec,
        indexProjection: Collection.createIndexProjectionObj(indexSpec),
        indexedDocuments: [],
      };

      writeJsonSync(indexJsonPath, indexDefault, { spaces: 2 });

      const documentFileNameArr = readdirSync(this.documentsPath);
      const documentArr: JSONObject[] = [];

      for (const documentFileName of documentFileNameArr) {
        documentArr.push(readJsonSync(join(this.documentsPath, documentFileName)));
      }

      this.indexMany(documentArr, indexJsonPath);
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
