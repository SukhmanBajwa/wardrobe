const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// This method wraps all fetch calls to take care of auth status to avoid unauthorized 401 errors.
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  await sleep(0);
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    window.location.href = "/loginPage";
    throw new Error("Unauthorized");
  }
  return res;
}
