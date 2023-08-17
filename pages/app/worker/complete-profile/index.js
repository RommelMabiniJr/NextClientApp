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
    const { data: session, loading, update } = useSession();
    const toast = useRef(null);
    const router = useRouter();
    
    if (!loading && !session) {
        return <div>Loading...</div>;
    }

    const items = [
        {
            label: 'Profile',
        },
        {
            label: 'Experience',
        },
        {
            label: 'Background',
        },
        {
            label: 'Verification',
        },
    ];

    const formik = useFormik({
        initialValues: {
            bio: '',
            servicesOffered: [],
            availability: '',

            workExperience: '',
            hourlyRate: 0.00,
            skills: '',

            languages: '',
            education: "College",
            certifications: '',
        },
        
        validate: completeProfileValidate,
        onSubmit: onSubmit,
    })

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    async function onSubmit(values) {
        try {
            console.log(values);

            const response = await axios({
                method: 'post',
                data: { ...values, uuid: session.user.uuid },
                withCredentials: true,
                url: 'http://localhost:5000/worker/complete-profile'
            });
            
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Profile created Succesfully', life: 3000 });
            
            // Make session user object reflect changes from the database (i.e. completedProfile: true)
            console.log({
                ...session,
                user: {
                    ...session.user,
                    completedProfile: "true",
                },
            })
            await update({
                ...session,
                user: {
                    ...session.user,
                    completedProfile: "true",
                },
            });
            
            console.log(session);
            router.push('/app/worker-dashboard?completedProfile=true');
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


