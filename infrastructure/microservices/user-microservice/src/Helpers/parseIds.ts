export function parseIds(ids: string | undefined): number[] {
  if (ids) {
    const idArray = ids.split(",");
    return idArray.map((id) => Number(id));
  } else {
    return [];
  }
}
