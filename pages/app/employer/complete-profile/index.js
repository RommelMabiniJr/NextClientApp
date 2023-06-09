import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Steps } from 'primereact/steps';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import axios from 'axios';
import { completeProfileValidate } from '@/lib/validate';
import Link from 'next/link';
import setupSteps from './component/setupSteps';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';


const CompleteProfile = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { data: session, loading } = useSession();
    const toast = useRef(null);
    const router = useRouter();
    
    if (loading) {
        return <div>Loading...</div>;
    }

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
            hasPets: false,
            specificNeeds: '',
            paymentMethods: [],
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
        try {
            const response = await axios({
                method: 'post',
                data: { ...values, uuid: session.user.uuid },
                withCredentials: true,
                url: 'http://localhost:5000/employer/complete-profile'
            });
            
            console.log(response.data);

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Profile created Succesfully', life: 3000 });
            router.push(`/app/employer-dashboard`);
            
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
        }
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
                            <Toast ref={toast}/>
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