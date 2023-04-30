import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession, signOut } from 'next-auth/react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import EmployerNavbar from '@/layout/EmployerNavbar';
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
                const response = await axios.get(`/api/employers/${router.query.uuid}`);
                setEmployer(response.data);
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };
        fetchEmployer();
    }, [router.query.uuid]);

    // Update employer data on form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await axios.patch(`/api/employers/${router.query.uuid}`, employer);
            router.reload();
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmployer((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const displayHeader = () => {
        if (session.user.completedProfile == "false") {
            return <h1 className=''>Complete Employer Profile</h1>;
        } else {
            return <h1>Edit Employer Profile</h1>;
        }
    };

    return (
        <div>
            <EmployerNavbar session={session} handleSignOut={handleSignOut} />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className='p-5'>
                        {displayHeader()}
                        <ContactInformation session={session} />
                        <HouseholdInformation />
                        <PaymentInformation />
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