import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    async function sendLogout() {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/logout/",
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) {
        router.push("/loginPage");
      }
    }
    sendLogout();
  }, []);
  return (
    <>
      <h1> Thank you for visiting. You have been logged out </h1>
    </>
  );
}
