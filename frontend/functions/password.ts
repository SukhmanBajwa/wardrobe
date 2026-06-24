import { PassThrough } from "stream";
import { fetchWithAuth } from "./fetchWithAuth";

export async function changePassword(password1: string, password2: string) {
  const res = await fetchWithAuth(
    process.env.NEXT_PUBLIC_API_URL + `/api/auth/password/change/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        new_password1: password1,
        new_password2: password2,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
}

export async function resetPassword() {}
