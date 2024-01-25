import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import Link from "next/link";

export default function LandingNavBtns() {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session) {
    return (
      <Link
        href={
          session?.user?.userType === "household employer"
            ? "/app/employer-dashboard"
            : "/app/worker-dashboard"
        }
      >
        <Button
          icon="pi pi-arrow-right"
          iconPos="right"
          label="Go to Dashboard"
          rounded
          className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white"
        ></Button>
      </Link>
    );
  }

  return (
    <>
      <Link href="auth/login">
        <Button
          label="Login"
          text
          rounded
          className="border-none font-light line-height-2 text-blue-500"
        ></Button>
      </Link>
      <Link href="/register">
        <Button
          label="Register"
          rounded
          className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white"
        ></Button>
      </Link>
    </>
  );
}
