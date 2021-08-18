export interface UnknownObject {
  [key: string]: any;
}
export interface ProjectionObject extends Document {
  [key: string]: 0 | 1 | ProjectionObject;
}
export declare type JSONArray = Array<string | number | JSONObject | JSONArray | boolean | null>;
export interface JSONObject {
  [key: string]: string | number | JSONObject | JSONArray | boolean | null;
}
export interface Document extends JSONObject {}
export declare type Query<D extends Document> = Partial<D>;
export interface IndexSpecification {
  [key: string]: 0;
}
export interface IndexObject extends JSONObject {
  indexSpecification: IndexSpecification;
  jsonFileName: string;
}
export interface IndexesObject extends JSONObject {
  indexes: IndexObject[];
}
export interface IndexedDocumentObject extends JSONObject {
  indexQuery: JSONObject;
  _id: string;
}
export interface IndexedDocumentsObject extends JSONObject {
  indexedDocuments: IndexedDocumentObject[];
}
export declare type Projection<T extends Document> = {
  [Key in keyof T]?: 0 | 1;
};
