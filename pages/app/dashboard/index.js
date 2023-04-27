import { getSession, useSession, signOut } from 'next-auth/react';

export default function Dashboard() {
    const { data: session } = useSession();
    
    const handleSignOut = () => {
        signOut();
    }
    
    return (
        <div>
            {session ? <DisplayDashboard session={session} handleSignOut={handleSignOut} /> : <div>loading...</div>}
        </div>
    )
}

const DisplayDashboard = ({session, handleSignOut}) => {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>{session.user.name}</p>
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