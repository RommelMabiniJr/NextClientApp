import React, { useState, useEffect } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { InputSwitch } from 'primereact/inputswitch';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { PaymentService } from '@/layout/service/PaymentService';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Image } from 'primereact/image';


const ServiceSelectStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
    const services = [
        {
            id: 1,
            name: 'Child Care',
            description: 'Providing safe and nurturing care for children in their homes, including activities and educational support.',
            icon: 'child.png',
        },
        {
            id: 2,
            name: 'Elder Care',
            description: 'Assisting elderly individuals with daily living activities, such as grooming, medication management, and companionship.',
            icon: 'grandfather.png',
        },
        {
            id: 3,
            name: 'Pet Care',
            description: 'Caring for pets in their homes, including feeding, walking, and administering medications.',
            icon: 'pawprint.png',
        },
        {
            id: 4,
            name: 'House Services',
            description: 'Performing various household tasks, such as cleaning, laundry, and organization, to help clients maintain a comfortable living space.',
            icon: 'bucket.png',
        },
    ];


    const handleCardClick = (service) => {
        formik.setFieldValue('serviceId', service.id);
        handleNextStep();
    }


    const serviceCards = services.map((service) => (
        <div className='col-12 md:col-6 lg:col-3' key={service.name}>
            <Button className="h-full bg-bluegray-600 hover:bg-bluegray-400 border-bluegray-700" onClick={(e) => handleCardClick(service)}>
                <Card className='h-full service-card'>
                    <Image src={`/layout/${service.icon}`} alt={service.name} width='80'/>
                    <h5 className='service-name'>{service.name}</h5>
                    <p>{service.description}</p>
                </Card>
            </Button>
        </div>
    ));

    return (
        <div>
            <h1 className='text-center'>What care service do you need?</h1>
            <div className='grid p-justify-center'>
                {serviceCards}
            </div>
        </div>
    );
};

const JobTypeStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

    const jobTypes = [
        { name: 'Full Time', value: 'full-time', code: 'FT', description: 'A job with consistent work for 40+ hours per week.', icon: 'pi-clock' },
        { name: 'Part Time', value: 'part-time', code: 'PT', description: 'A job with flexible hours for less than 40 hours per week.', icon: 'pi-clock' },
        { name: 'Temporary', value: 'temporary', code: 'OT', description: 'Short-term work available on demand.', icon: 'pi-clock' },
    ];

    const handleCardClick = (job) => {
        formik.setFieldValue('jobType', job.value);
        handleNextStep();
    }


    const jobCards = jobTypes.map((job) => (
        <div className='col-12 md:col-6 lg:col-4' key={job.name}>
            <Button className="h-full bg-bluegray-600 hover:bg-bluegray-400 border-bluegray-700" onClick={() => handleCardClick(job)}>
                <Card className='h-full job-card'>
                    <i className={`text-xl pi ${job.icon} job-icon`}></i>
                    <h5 className='job-name'>{job.name}</h5>
                    <p>{job.description}</p>
                </Card>
            </Button>
        </div>
    ));

    return (
        <div>
            <h1 className='text-center'>What job type do you need?</h1>
            <div className='grid p-justify-center'>
                {jobCards}
            </div>
        </div>
    );
};

const JobDatesStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

    return (
        <div>
            <div className="card p-fluid">
                <h5>What dates do you need Care?</h5>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="jobStartDate">Job Starting Date</label>
                        <Calendar id="jobStartDate" value={formik.values.jobStartDate} onChange={formik.handleChange} showIcon />
                    </div>
                    <div className="field col">
                        <label htmlFor="jobStartTime">Job Starting Time</label>
                        <Calendar id="jobStartTime" value={formik.values.jobStartTime} onChange={formik.handleChange} timeOnly hourFormat='12' />
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="jobEndDate">Job Ending Date</label>
                        <Calendar id="jobEndDate" value={formik.values.jobEndDate} onChange={formik.handleChange} showIcon />
                    </div>
                    <div className="field col">
                        <label htmlFor="jobEndTime">Job Ending Time</label>
                        <Calendar id="jobEndTime" value={formik.values.jobEndTime} onChange={formik.handleChange} timeOnly hourFormat='12' />
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-content-between gap-2 mt-4">
                <Button label="Back" className='' icon="pi pi-arrow-left" iconPos="left" onClick={handlePreviousStep} />
                <Button label="Continue" className='' icon="pi pi-arrow-right" iconPos="right" onClick={handleNextStep} />
            </div>
        </div>
    );
};

const JobLocationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

    return (
        <div className="card p-fluid grid">

            <div className="col-5">
                <h5>Vertical</h5>
                <div className="field">
                    <label htmlFor="email1">Rate per Hour</label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="">₱</i>
                        </span>
                        <InputNumber value={formik.values.payRate} onValueChange={formik.handleChange} min={0} max={100} minFractionDigits={2} maxFractionDigits={5} />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="age1">Payment Method</label>
                    <InputText id="age1" type="text" />
                </div>
            </div>
            <Divider className='col-1' layout='vertical'></Divider>
            <div className="col-5">
                <h5>Vertical</h5>
                <div className="field">
                    <label htmlFor="email1">City/Municipality</label>
                    <InputText id="email1" type="text" />
                </div>
                <div className="field">
                    <label htmlFor="age1">Barangay</label>
                    <InputText id="age1" type="text" />
                </div>
                <div className="field">
                    <label htmlFor="name1">Street</label>
                    <InputText id="name1" type="text" />
                </div>
            </div>
        </div>
    );
};

const JobDescriptionStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

    return (
        <div>
            <div className="card p-fluid">
                <h5>Describe the Job</h5>
                <div className="field grid">
                    <label htmlFor="jobTitle" className="col-12 mb-2 md:col-2 md:mb-0">
                        Job Title
                    </label>
                    <div className="col-12 md:col-10">
                        <InputText value={formik.jobTitle} onChange={formik.handleChange} className='text-lg' type='text' id="jobTitle" />
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="jobDescription" className="col-12 mb-2 md:col-2 md:mb-0">
                        Job Description
                    </label>
                    <div className="col-12 md:col-10">
                        <InputTextarea value={formik.jobDescription} onChange={formik.handleChange} style={{ width: '100%', height: '200px' }} id="jobDescription" />
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-content-between gap-2 mt-4">
                <Button label="Back" className='' icon="pi pi-arrow-left" iconPos="left" onClick={handlePreviousStep} />
                <Button label="Post The Job" className='' icon="pi pi-check" iconPos="right" onClick={formik.handleSubmit} />
            </div>
        </div>
    );
};

// 
const jobCreateSteps = [
    ServiceSelectStep,
    JobTypeStep,
    JobDatesStep,
    JobDescriptionStep,
];

export default jobCreateSteps;