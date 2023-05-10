import React, { useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';


const WorkerNavbar = ({ handleSignOut }) => {
    const { data: session } = useSession();
    const menu = useRef(null);
    //const router = useRouter();
    const toast = useRef(null);

    const items = session && [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            url: '/app/worker-dashboard',
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            url: `/app/worker/${session.user.uuid}`,
        },
        {
            label: 'Job Listings',
            icon: 'pi pi-fw pi-briefcase',
            url: '/app/worker/job-listings',
            command: () => {
                // handle logout logic here
            },
        },
        {
            label: 'Bookings',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                // handle logout logic here
            },
        },
    ];

    // This will check if session exists inorder to display the profile items
    const profileItems = session && [
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            url: `/app/worker/${session.user.uuid}`,
        },
        {
            label: 'Wallet Balance',
            icon: 'pi pi-fw pi-wallet',
            command: () => {
                // handle logout logic here
            }
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                // handle logout logic here
                handleSignOut();
            },
        },
    ];

    const start =
        <Link href="/app/employer-dashboard" className="flex align-items-center">
            <img src={`/layout/logo.png`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
            <span className="text-900 font-bold text-2xl line-height-3 mr-8">TagaTulong</span>
        </Link>

    const end =
        <div className="flex flex-row align-items-center border-circle p-d-flex p-flex-row p-ai-center">
            {/* <Image className='w-min h-min mr-4' src='/layout/profile-default.png' width='40'/> */}
            <Button size='small' className='mr-2' rounded icon="pi pi-inbox" aria-label="Message" />
            <Button size='small' className='mr-2' rounded icon="pi pi-bell" aria-label="Notification" />
            <Menu className='' model={profileItems} popup ref={menu} id='popup_menu' />
            <Avatar className='mr-4' image='/layout/profile-default.png' size='large' shape='circle' onClick={(e) => menu.current.toggle(e)}></Avatar>
        </div>


    return (
        <div>
            <Menubar start={start} model={items} end={end} />
        </div>
    );
};

export default WorkerNavbar;
