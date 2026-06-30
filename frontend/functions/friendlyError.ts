export async function friendlyError(
  status: number,
  context: string,
  response?: Response,
): Promise<Error> {
  if (status === 400 && response) {
    try {
      const data = await response.json();
      // Django returns errors as { field: ["message"] } or { non_field_errors: ["message"] }
      const firstError = Object.values(data).flat()[0] as string;
      if (firstError) return new Error(firstError);
    } catch {
      // fall through to generic message
    }
  }

  const messages: Record<number, string> = {
    403: `You don't have permission to ${context}.`,
    404: `Could not find the resource for ${context}.`,
    500: `Server error while trying to ${context}. Try again later.`,
  };
  return new Error(
    messages[status] ??
      `Unexpected error (${status}) while trying to ${context}.`,
  );
}
