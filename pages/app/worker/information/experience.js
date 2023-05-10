import React, { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import EditButton from './components/infoComponents';
import { useFormik } from 'formik';
import axios from 'axios';
import { Chip } from 'primereact/chip';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { Chips } from 'primereact/chips';

const ExperienceInformation = ({ session, worker }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const toast = useRef(null);

    const formik = useFormik({
        initialValues: {
            workExperience: worker.work_experience,
            hourlyRate: worker.hourly_rate,
            skills: worker.skills,
        },
        onSubmit: async (values) => {

            const skillsString = values.skills.join(',');

            try {
                const response = await axios({
                    method: 'patch',
                    data: { ...values, skillsString, uuid: session.user.uuid },
                    withCredentials: true,
                    url: 'http://localhost:5000/worker/update-info/experience',
                });

                console.log(response.data);

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Worker information Updated!',
                    life: 3000,
                });

                toggleEditMode();
            } catch (error) {
                console.error(error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Something went wrong',
                    life: 3000,
                });
            }
        },
    });

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const renderHourlyRateField = () => {
        return (
            <div className="p-field">
                <InputNumber
                    id='hourlyRate'
                    className='w-full'
                    inputId="hourlyRate"
                    value={formik.values.hourlyRate}
                    onValueChange={formik.handleChange}
                    showButtons
                    mode="currency"
                    currency="PHP"
                />
            </div>
        );
    };


    function MultipleSkillsOpt({ formik, isEditMode }) {
        return (
          <>
            {console.log(formik.values.skills)}
            {isEditMode ? (
                <Chips 
                    id="skills"
                    value={formik.values.skills}
                    onChange={formik.handleChange}
                />
            ) : (
              <div className="p-mt-2 flex flex-wrap">
                {formik.values.skills &&
                  formik.values.skills.map((skill, index) => (
                    <Chip key={index} label={skill} className="mr-1 mb-1" />
                  ))}
              </div>
            )}
          </>
        );
    }

    const renderExperienceField = () => {
        return (
            <div className="p-field">
                <InputTextarea
                    autoResize
                    className='w-full'
                    id="workExperience"
                    value={formik.values.workExperience}
                    onChange={formik.handleChange}
                />
            </div>
        );
    };


    return (
        <div className='flex flex-row justify-content-between'>
            <Toast ref={toast} />
            <div className="panel-fields p-mb-2 grid gap-3">
                <div className='col-6'>
                    <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Experience: </div>
                    {isEditMode ? renderExperienceField() : <div className="col text-900">{formik.values.workExperience}</div>}
                </div>
                <Divider layout='vertical' />
                <div className='col-5 grid gap-3'>
                    <div className='col-12'>
                        <div className="text-500 font-medium">Hourly Rate: </div>
                        <div className='col'>
                            {isEditMode ? renderHourlyRateField() : <div className="col text-900">₱ {formik.values.hourlyRate}</div>}
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className="text-500 font-medium">Additional Skills: </div>
                        <div className='col'>
                            <MultipleSkillsOpt formik={formik} isEditMode={isEditMode} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-none'>
                <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} onSubmit={formik.handleSubmit} />
            </div>
        </div>
    );
};

export default ExperienceInformation;
