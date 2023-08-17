import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';

const UserRouter = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // console.log(session)
    const redirect = async () => {
      if (status === 'authenticated' && session) {
        if (session.user.userType === 'household employer') {
          // console.log(session.user.userType)
          router.push('http://localhost:3000/app/employer-dashboard');
        } else if (session.user.userType === 'domestic worker') {
          // console.log(session.user.userType)
          router.push('http://localhost:3000/app/worker-dashboard');
        }
      }
    };
    redirect();
  }, [status, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return null;
};


export default UserRouter;



