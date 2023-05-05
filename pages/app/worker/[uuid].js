import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession, signOut } from 'next-auth/react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import WorkerNavbar from '@/layout/WorkerNavbar';
import ContactInformation from './information/contact';
import HouseholdInformation from './information/household';
import PaymentInformation from './information/payment';

export default function EmployerProfile() {
    const { data: session } = useSession();
    const handleSignOut = () => {
        signOut();
    }

    const router = useRouter();
    const [employer, setEmployer] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Fetch employer data on page load
    
    useEffect(() => {
        const fetchEmployer = async () => {
            setIsLoading(true);
            try {
                console.log(router.query.uuid)
                const response = await axios.get(`http://localhost:5000/employer/${router.query.uuid}`);
                setEmployer(response.data);
                console.log(employer)
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };
        fetchEmployer();
    }, [router.query.uuid]);

    const displayHeader = () => {
        return <h1>Edit Employer Profile</h1>;
    };

    return (
        <div>
            <WorkerNavbar session={session} handleSignOut={handleSignOut} />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className='p-5'>
                        {displayHeader()}
                        <ContactInformation session={session} />
                        <HouseholdInformation session={session} employer={employer} />
                        <PaymentInformation session={session} employer={employer} />
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
                permanent: false
            }
        }
    }

    return {
        props: { session }
    }
};