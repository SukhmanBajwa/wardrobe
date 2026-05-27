import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
  // return (
  // <div>
  //   <main>
  //     <>
  //       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  //         <Link
  //           href="/register"
  //           className="text-sm text-gray-400 hover:text-gray-200 transition"
  //         >
  //           Register
  //         </Link>
  //       </button>
  //       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  //         <Link
  //           href="/login"
  //           className="text-sm text-gray-400 hover:text-gray-200 transition"
  //         >
  //           Login
  //         </Link>
  //       </button>
  //     </>
  //   </main>
  // </div>
  // );
}
