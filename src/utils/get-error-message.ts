/** Extract a message from the given `error` property. */
export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : `Error ${error}`;
}
