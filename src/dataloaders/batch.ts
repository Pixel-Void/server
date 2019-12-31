import { get } from 'lodash';

export function batchMany<T>(keys: any[], entities: any[], entityKeyIterator: [keyof T, ...string[]]): T[] {
  const entityMap = keys.reduce((accumulator, currentValue) => (accumulator[currentValue] = [], accumulator), {});
  entities.forEach((entity: any) => {
    const iterator = get(entity, entityKeyIterator as any);
    entityMap[iterator] = [...entityMap[iterator], entity];
  });

  return keys.map(key => entityMap[key]);
}

export function batch<T>(keys: any[], entities: any[], entityKeyIterator: [keyof T, ...string[]]) {
  const entityMap = keys.reduce((accumulator, currentValue) => (accumulator[currentValue] = [], accumulator), {});
  entities.forEach(entity => {
    const iterator = get(entity, entityKeyIterator as any);
    entityMap[iterator] = entity;
  });

  return keys.map(key => entityMap[key]);
}
