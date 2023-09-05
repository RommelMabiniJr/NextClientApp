import React, { useState } from 'react';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { ProgressBar } from 'primereact/progressbar';

export default function JobApplicationTimeline() {
    // initial state for application stage events
    const initialEvents = [
        { status: 'Application Submitted', date: '15/08/2023 10:30', icon: 'pi pi-user-plus', color: '#4CAF50' },
        { status: 'Application Reviewed', date: '17/08/2023 14:00', icon: 'pi pi-paperclip', color: '#2196F3' },
        { status: 'Interview Scheduled', date: '20/08/2023 09:00', icon: 'pi pi-calendar-plus', color: '#FFC107' },
        { status: 'Interview Conducted', date: '22/08/2023 11:30', icon: <img alt="calendar-check" src='../../layout/calendar-check.svg' style={{ height: "1.25rem", fill: "#ffffff" }} />, color: '#E91E63' },
        { status: 'Background Check', date: '25/08/2023 16:15', icon: 'pi pi-shield', color: '#9C27B0' },
        { status: 'Offer Extended', date: '28/08/2023 13:00', icon: 'pi pi-dollar', color: '#673AB7' },
        { status: 'Hired', date: '30/08/2023 10:00', icon: 'pi pi-check', color: '#00BCD4' }
    ];

    // State variable for application stage events
    const [events, setEvents] = useState(initialEvents);

    // function to update events
    const updateEvents = (newEvents) => {
        setEvents(newEvents);
    }

    const addEvent = (newEvent) => {
        const prevEvents = [...events]; // copy of events array
        setEvents((prevEvents) => [...prevEvents, newEvent]);
    }

    // function to handle failed stage
    const handleFailedStage = (failedStageName, StageNum) => {
        const failedEvent = {
            status: `${failedStageName} Failed`,
            date: new Date().toLocaleDateString(), // TODO: format date properly
            icon: 'pi pi-times',
            color: '#F44336'
        };

        addEvent(failedEvent); // add failed event to timeline  
    }


    const customizedMarker = (item) => {
        const isPrimeReactIcon = typeof item.icon === 'string'; // when icon is string, it refers to PrimeReact font icon
        const iconContent = isPrimeReactIcon ? <i className={item.icon}></i> : item.icon;

        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" style={{ backgroundColor: item.color }}>
                {iconContent}
            </span>
        );
    }

    const customizedContent = (item) => (
        <Card title={item.status} subTitle={item.date}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ligula eu metus vehicula euismod. Suspendisse potenti.</p>
            <Button label="Learn more" className="p-button-text"></Button>
        </Card>
    );

    return (
        <div className="card">
            <div className='px-6'>
                <h1 className='text-center mb-3'>Your Job Application</h1>
                <h4 className='text-center mb-6'><Chip label="In Progress" icon="pi pi-spinner" /></h4> {/* Add this subheading */}
                {/* <ProgressBar value={80} style={{height: "20px"}} /> */}
            </div>
            <Timeline value={events} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />

            {/* Buttons to trigger scenario updates */}
            <Button label="Interview Not Successful" onClick={() => handleFailedStage('Interview')} className="p-button-text" />
        </div>
    );
}
