// Helper to build a friendly error message
export function friendlyError(status: number, context: string): Error {
  const messages: Record<number, string> = {
    400: `Bad request while trying to ${context}.`,
    401: "Session expired. Please log in again.",
    403: `You don't have permission to ${context}.`,
    404: `Could not find the resource for ${context}.`,
    500: `Server error while trying to ${context}. Try again later.`,
  };
  return new Error(
    messages[status] ??
      `Unexpected error (${status}) while trying to ${context}.`,
  );
}
