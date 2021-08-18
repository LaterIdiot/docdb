import { JSONObject, UnknownObject } from './types';

export function isObject(object: unknown): boolean {
  return object != null && typeof object === 'object';
}

export function isObjectOnly(object: unknown): boolean {
  const objectJsonStr = JSON.stringify(object);
  return isObject(object) && objectJsonStr.startsWith('{') && objectJsonStr.endsWith('}');
}

export function deepEqual(object1: UnknownObject, object2: UnknownObject): boolean {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false;
    }
  }

  return true;
}
