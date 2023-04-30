import EmployerNavbar from '@/layout/EmployerNavbar';
import { getSession, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSignOut = () => {
        signOut();
    }

    // Do not use this function. It is still in development.
    const checkProfileCompletion = () => {
        if (session.user.completedProfile == "true") {
            return <DisplayDashboard session={session} handleSignOut={handleSignOut} />;
        } else {
            router.push('/app/employer/complete-profile');
            return <div>Redirecting...</div>;
        }
    };


    return (
        <div>
            {session ? <DisplayDashboard session={session} handleSignOut={handleSignOut} /> : <div>loading...</div>}
        </div>
    )
}

const DisplayDashboard = ({ session, handleSignOut }) => {
    console.log(session);

    return (
        <div>
            <EmployerNavbar session={session} handleSignOut={handleSignOut} />
            <h1>Dashboard</h1>
            <p>{session.user.name ? session.user.name : session.user.firstName}</p>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export async function getServerSideProps({ req }) {
    const session = await getSession({ req });

    if (!session) {

        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }

    return {
        props: { session }
    }
};