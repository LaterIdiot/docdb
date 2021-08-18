<<<<<<< HEAD:types/src/tools/types.d.ts
export interface UnknownObject extends Object {
    [key: string]: any;
=======
export interface UnknownObject {
  [key: string]: any;
>>>>>>> a4ae36663598168dfb21c8cf231a41d2f1cd74ac:types/tools/types.d.ts
}
export interface ProjectionObject extends Document {
    [key: string]: 0 | 1 | ProjectionObject;
}
export declare type JSONArray = Array<string | number | JSONObject | JSONArray | boolean | null>;
export interface JSONObject {
  [key: string]: string | number | JSONObject | JSONArray | boolean | null;
}
export interface Document extends JSONObject {
}
export declare type Query<D extends Document> = Partial<D>;
export interface IndexSpecification {
<<<<<<< HEAD:types/src/tools/types.d.ts
    [key: string]: 0 | IndexSpecification;
=======
  [key: string]: 0;
>>>>>>> a4ae36663598168dfb21c8cf231a41d2f1cd74ac:types/tools/types.d.ts
}
export interface IndexObject extends JSONObject {
  indexSpecification: IndexSpecification;
  jsonFileName: string;
}
export interface IndexesObject extends JSONObject {
  indexes: IndexObject[];
}
export interface IndexedDocumentObject extends JSONObject {
<<<<<<< HEAD:types/src/tools/types.d.ts
    indexedDocument: JSONObject;
    _id: string;
}
export interface IndexedDocumentsObject extends JSONObject {
    indexSpecification: IndexSpecification;
    indexProjection: ProjectionObject;
    indexedDocuments: IndexedDocumentObject[];
=======
  indexQuery: JSONObject;
  _id: string;
}
export interface IndexedDocumentsObject extends JSONObject {
  indexedDocuments: IndexedDocumentObject[];
>>>>>>> a4ae36663598168dfb21c8cf231a41d2f1cd74ac:types/tools/types.d.ts
}
export declare type Projection<T extends Document> = {
    [Key in keyof T]?: 0 | 1;
};
