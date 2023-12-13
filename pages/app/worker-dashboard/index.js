import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Divider } from "primereact/divider";
import WorkerNavbar from "@/layout/WorkerNavbar";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && session.user.completedProfile !== "true") {
      router.push("/app/worker/complete-profile");
    } else {
      setLoading(false);
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <WorkerNavbar session={session} handleSignOut={handleSignOut} />
          <div className=" mt-4 text-center">
            <h2 className="p-text-uppercase mb-2">
              Welcome, {session.user.firstName}!
            </h2>
            <h4 className="text-500 mb-3 mt-0">What would you like to do?</h4>
            <Divider className="p-mb-3" />
            <div className="flex text-left justify-content-evenly p-mt-4">
              <Card title="Job Applications">
                <p className="p-m-0">You have applied for 0 jobs in total.</p>
                <Button
                  disabled
                  label="View Applications"
                  icon="pi pi-briefcase"
                  className="p-mt-4"
                  onClick={() => router.push("/app/worker/job-applications")}
                />
              </Card>
              <Card className="" title="Search for Jobs">
                <p className="p-m-0">
                  Find a job that matches your skills and experience.
                </p>
                <Button
                  label="Search Jobs"
                  icon="pi pi-search"
                  className="p-mt-4"
                  onClick={() => router.push("/app/worker/job-listings")}
                />
              </Card>
              <Card title="Availability">
                <p className="p-m-0">
                  Set your availability for potential employers to see.
                </p>
                <Button
                  disabled
                  label="Edit Availability"
                  icon="pi pi-calendar"
                  className="p-mt-4"
                  onClick={() => router.push("/app/worker/availability")}
                />
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
