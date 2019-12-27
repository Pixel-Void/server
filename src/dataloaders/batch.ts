export function batchMany<T>(keys: any[], entities: any, entityKeyIterator: keyof T) {
  const entityMap = keys.reduce((accumulator, currentValue) => (accumulator[currentValue] = [], accumulator), {});
  entities.forEach((entity: any) => {
    entityMap[entity[entityKeyIterator]] = [...entityMap[entity[entityKeyIterator]], entity];
  });

  return keys.map(key => entityMap[key]);
}
