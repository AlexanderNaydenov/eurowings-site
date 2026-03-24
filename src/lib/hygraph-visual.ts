/**
 * Hygraph Visual Editor / Preview SDK: embedded components must use the **parent model
 * entry id** plus `data-hygraph-component-chain` (see ContentSection). Top-level
 * entries use `data-hygraph-entry-id` alone.
 */
export function hygraphListComponentChain(
  listFieldApiId: string,
  blockInstanceId: string
): string {
  return JSON.stringify([{ fieldApiId: listFieldApiId, instanceId: blockInstanceId }]);
}

export function hygraphSingleComponentChain(
  fieldApiId: string,
  componentInstanceId: string
): string {
  return JSON.stringify([{ fieldApiId, instanceId: componentInstanceId }]);
}
