export function updateSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value: string,
  resetPage = true,
): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  if (!value) next.delete(key);
  else next.set(key, value);
  if (resetPage && key !== 'page') next.delete('page');
  return next;
}
