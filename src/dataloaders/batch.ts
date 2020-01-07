import { groupBy } from 'lodash';
import { getConnection } from 'typeorm';

export function batchMany<T>(keys: any[], entities: any[], entityKeyIterator: keyof T): T[][] {
  const entityMap = groupBy(entities, entityKeyIterator);
  return keys.map(key => !!entityMap[key] ? entityMap[key] : []);
}

export function batch<T>(keys: any[], entities: any[], entityKeyIterator: keyof T) {
  const entityMap = groupBy(entities, entityKeyIterator);
  return keys.map(key => entityMap[key][0]);
}

export interface PaginatedBatch { id: string; take: number; }

export async function paginatedBatch<T>({
  select, where, entity, take = 10,
}: {
  select: keyof T, where: [keyof T, string[]], entity: string, take?: number,
}) {
  const manager = getConnection();
  const [column, keys] = where;
  const sql = keys.map((key, index) => `(SELECT ${select}, ${entity}."${column}" FROM ${entity} WHERE ${entity}."${column}" = $${index + 1} LIMIT ${take})`);
  const results: any[] = await manager.query(sql.join(' UNION '), keys);
  return groupBy(results, column);
}
