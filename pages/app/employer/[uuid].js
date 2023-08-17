import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession, signOut } from 'next-auth/react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import EmployerNavbar from '@/layout/EmployerNavbar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import ContactInformation from './information/contact';
import HouseholdInformation from './information/household';
import PaymentInformation from './information/payment';
import DisplayHeader from '@/layout/components/Cropper';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

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
        console.log(session);
    }, [session, router.query.uuid]);


    if (!session) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    const handleImgClick = () => {
        console.log('clicked')
    }

    const displayHeader = () => {
        return (
            <>
                <div className='text-center'>
                    <div className='relative w-max mx-auto py-2'>
                        <Avatar image='/layout/profile-default.png' alt='profile' shape='circle' className='h-8rem w-8rem md:w-10rem md:h-10rem shadow-2 cursor-pointer ' />
                        <Badge value={<i className='pi pi-camera' />} size='large' className='absolute bottom-0 left-50 translate-badge cursor-pointer p-ripple' onClick={handleImgClick}>
                        </Badge>
                    </div>
                    <h2 className='my-2'>{session.user.firstName + " " + session.user.lastName}</h2>
                    <h5 className='my-3 font-light'>{session.user.city} | {session.user.barangay} | {session.user.street}</h5>
                    {/* <Button label='Edit Profile' className='p-button-outlined' /> */}
                </div>
            </>
        );
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
                        <DisplayHeader session={session} />
                        <Accordion multiple activeIndex={[0, 1, 2, 3]}>
                            {/* {displayHeader()} */}
                            <AccordionTab header="Contact Information">
                                <ContactInformation session={session} />
                            </AccordionTab>
                            <AccordionTab header="Household Information">
                                <HouseholdInformation session={session} employer={employer} />
                            </AccordionTab>
                            <AccordionTab header="Payment Information">
                                <PaymentInformation session={session} employer={employer} />
                            </AccordionTab>
                        </Accordion>
                    </div>
                </>
            )}
        </div>
    );
}

