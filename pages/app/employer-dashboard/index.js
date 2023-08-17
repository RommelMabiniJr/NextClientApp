import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { getSession, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import EmployerNavbar from '@/layout/EmployerNavbar';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // This is usually done by redirecting to /auth.
      router.push('/auth/login');
    },
  });


  
  useEffect(() => {
    if (session && session.user.completedProfile !== 'true') {
      router.push('/app/employer/complete-profile');
    } else {
      setLoading(false);
    }

  }, [session]);
  
  if (status === 'loading') {
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
          <EmployerNavbar session={session} handleSignOut={handleSignOut} />
          <div className=" mt-4 text-center">
            <h2 className="p-text-uppercase mb-2">Welcome, {session.user.firstName}!</h2>
            <h4 className="text-500 mb-3 mt-0">What would you like to do?</h4>
            <Divider className="p-mb-3" />
            <div className="flex text-left justify-content-evenly p-mt-4">
              <Card title="Jobs Overview">
                <p className="p-m-0">You have posted 5 jobs with 20 applicants in total.</p>
                <Button
                  label="View Jobs"
                  icon="pi pi-briefcase"
                  className="p-mt-4"
                  onClick={() => router.push('/app/posts')}
                />
              </Card>
              <Card className='' title="Add a New Job">
                <p className="p-m-0">Post a new job to find your next domestic worker.</p>
                <Button
                  label="Add Job"
                  icon="pi pi-plus"
                  className="p-mt-4"
                  onClick={() => router.push('/app/posts/create')}
                />
              </Card>
              <Card title="Book a Worker">
                <p className="p-m-0">Book a domestic worker directly from your dashboard.</p>
                <Button
                  label="Book Worker"
                  icon="pi pi-calendar"
                  className="p-mt-4"
                  onClick={() => router.push('/app/bookings/create')}
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
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
