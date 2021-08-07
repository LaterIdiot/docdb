export interface UnknownObject {
  [key: string]: any;
}

// TODO: put JSON types somewhere else and may need reevaluation
export type JSONArray = Array<string | number | JSONObject | JSONArray | boolean | null>;

export interface JSONObject {
  [key: string]: string | number | JSONObject | JSONArray | boolean | null;
}

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
