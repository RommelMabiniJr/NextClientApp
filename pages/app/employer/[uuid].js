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
    const { data: session, status } = useSession();
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
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };
        fetchEmployer();
    }, [session, router.query.uuid]);


    if (!session) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    const displayHeader = () => {
        return <h1>Edit Employer Profile</h1>;
    };

    return (
        <div>
            {console.log(employer)}
            <EmployerNavbar session={session} handleSignOut={handleSignOut} />
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

