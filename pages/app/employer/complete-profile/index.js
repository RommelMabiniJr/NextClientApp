import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { Steps } from 'primereact/steps';
import { Divider } from 'primereact/divider';
import { SelectButton } from 'primereact/selectbutton';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { completeProfileValidate } from '@/lib/validate';
import Link from 'next/link';
import setupSteps from './component/setupSteps';


const CompleteProfile = () => {

    const [currentStep, setCurrentStep] = useState(0);

    const items = [
        {
            label: 'Household',
        },
        {
            label: 'Payment',
        },
        {
            // Will be used to ask to create bio
            label: 'Additional',
        },
        {
            label: 'Verification',
        },
    ];

    const formik = useFormik({
        initialValues: {
            householdSize: '',
            hasPets: '',
            specificNeeds: '',
            paymentMethods: '',
            paymentFrequency: '',
            bio: '',
        },
        
        validate: completeProfileValidate,
        onSubmit
    })

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    async function onSubmit(values) {
        axios({
            method: 'post',
            data: { ...values},
            withCredentials: true,
            url: 'http://localhost:5000/register'
        }).then((res) => console.log(res)).catch((err) => console.log(err));
    }

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const StepComponent = setupSteps[currentStep];

    return (
        <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <Link href="/"><img src="/layout/logo.png" alt="hyper" height={50} className="mb-3" /></Link>
                    <div className="text-900 text-3xl font-medium mb-3">Complete your Profile</div>
                    <span className="text-600 font-medium line-height-3">Finish Setting Up Your Account</span>
                </div>

                <form>
                    <div>
                        <Steps className='mx-auto w-10' model={items} aria-expanded="true" activeIndex={currentStep} />
                        <Divider className='mx-auto w-10 mb-5' />

                        <div className='mx-auto w-10'>
                            <StepComponent
                                isFormFieldInvalid={isFormFieldInvalid}
                                getFormErrorMessage={getFormErrorMessage}
                                formik={formik}
                                onSubmit={onSubmit}
                                handleNextStep={handleNextStep}
                                handlePreviousStep={handlePreviousStep}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default CompleteProfile;