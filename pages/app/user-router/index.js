import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';

const UserRouter = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // console.log(session)
    if (status === 'authenticated' && session) {
      if (session.user.userType === 'household employer') {
        // console.log(session.user.userType)
        router.push('http://localhost:3000/app/employer-dashboard');
      } else if (session.user.userType === 'domestic worker') {
        // console.log(session.user.userType)
        router.push('http://localhost:3000/app/worker-dashboard');
      }
    }
  }, [status, session]);

  return null;
};


export default UserRouter;

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

