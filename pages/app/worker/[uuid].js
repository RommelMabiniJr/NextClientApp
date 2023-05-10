import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, useSession, signOut } from 'next-auth/react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import axios from 'axios';
import WorkerNavbar from '@/layout/WorkerNavbar';
import ContactInformation from './information/contact';
import WorkerInformation from './information/workerInfo';
import ExperienceInformation from './information/experience';
import BackgroundInformation from './information/background';

export default function WorkerProfile() {
    const { data: session } = useSession();
    const handleSignOut = () => {
        signOut();
    }

    const router = useRouter();
    const [worker, setWorker] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Fetch worker data on page load

    useEffect(() => {
        const fetchWorker = async () => {
            setIsLoading(true);
            try {
                console.log(router.query.uuid)
                const response = await axios.get(`http://localhost:5000/worker/${router.query.uuid}`);

                //convert skills comma separated string to array
                response.data.skills = response.data.skills.split(',');

                setWorker(response.data);
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };
        fetchWorker();
    }, [session, router.query.uuid]);

    if (!session) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }
    
    const displayHeader = () => {
        return <h1>Edit Worker Profile</h1>;
    };
    
    return (
        <div>
            {console.log(worker)}
            <WorkerNavbar session={session} handleSignOut={handleSignOut} />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className='p-5'>
                        {displayHeader()}
                        <Accordion multiple activeIndex={[0,1,2,3]}>
                            <AccordionTab header="Contact Information">
                                <ContactInformation session={session} />
                            </AccordionTab>
                            <AccordionTab header="Worker Information">
                                <WorkerInformation session={session} worker={worker} />
                            </AccordionTab>
                            <AccordionTab header="Experience">
                                <ExperienceInformation session={session} worker={worker} />
                            </AccordionTab>
                            <AccordionTab header="Background">
                                <BackgroundInformation session={session} worker={worker} />
                            </AccordionTab>
                        </Accordion>
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