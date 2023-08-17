import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import EditButton from './components/infoComponents';
import { useFormik } from 'formik';
import axios from 'axios';

const HouseholdInformation = ({ session, employer }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const toast = useRef(null);

    const formik = useFormik({
        initialValues: {
            householdSize: employer.householdSize,
            hasPets: employer.hasPets ? true : false,
            specificNeeds: employer.specificNeeds,
        },
        onSubmit: async (values) => {
            try {
                const response = await axios({
                    method: 'patch',
                    data: { ...values, uuid: session.user.uuid },
                    withCredentials: true,
                    url: 'http://localhost:5000/employer/update-info/household',
                });

                console.log(response.data);

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Employer information Updated!',
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

    const renderHouseholdSizeField = () => {
        return (
            <div className="p-field">
                <InputText
                    id="householdSize"
                    value={formik.values.householdSize}
                    onChange={formik.handleChange}
                />
            </div>
        );
    };

    const renderHasPetsField = () => {
        return (
            <div className="p-field">
                <InputSwitch
                    id="hasPets"
                    name="hasPets"
                    checked={formik.values.hasPets}
                    onChange={formik.handleChange}
                />
            </div>
        );
    };

    const renderSpecificNeedsField = () => {
        return (
            <div className="p-field">
                <InputTextarea
                    autoResize
                    className='w-full'
                    id="specificNeeds"
                    value={formik.values.specificNeeds}
                    onChange={formik.handleChange}
                />
            </div>
        );
    };


    return (
        <div className="p-d-flex p-jc-between">
            <Toast ref={toast} />
            <div className='flex flex-row justify-content-between'>
                <div className="panel-fields p-mb-2 col">
                    <div className="p-mb-2 grid">
                        <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Household Size: </div>
                        {isEditMode ? renderHouseholdSizeField() : <div className="col text-900">{formik.values.householdSize}</div>}
                    </div>
                    <div className='divider my-3' />
                    <div className="p-mb-2 grid">
                        <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Has Pets: </div>
                        {isEditMode ? renderHasPetsField() : <div className="col text-900">{formik.values.hasPets.toString()}</div>}
                    </div>
                    <div className='divider my-3' />
                    <div className="p-mb-2 grid">
                        <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Specific Requirements: </div>
                        {isEditMode ? renderSpecificNeedsField() : <div className="col text-900">{formik.values.specificNeeds}</div>}
                    </div>
                </div>
                <div className='flex-none'>
                    <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} onSubmit={formik.handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default HouseholdInformation;
