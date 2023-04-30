import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import EditButton from './components/infoComponents';

const HouseholdInformation = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [hasPets, setHasPets] = useState('');
    const [specificRequirements, setSpecificRequirements] = useState('');
    
    const householdSizeOptions = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5+', value: '5+' }
      ];

    //When page is loaded, check if user have completed profile setup

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const renderNumberOfPeopleField = () => {
        return (
            <div className="p-field">
                <InputText id="numberOfPeople" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} />
            </div>
        );
    };

    const renderHasPetsField = () => {
        return (
            <div className="p-field">
                <InputText id="hasPets" value={hasPets} onChange={(e) => setHasPets(e.target.value)} />
            </div>
        );
    };

    const renderSpecificRequirementsField = () => {
        return (
            <div className="p-field">
                <InputTextarea autoResize className='w-full' id="specificRequirements" value={specificRequirements} onChange={(e) => setSpecificRequirements(e.target.value)} />
            </div>
        );
    };


    return (
        <div className="p-d-flex p-jc-between">
            <Panel header="Household Information" className="p-col-12 p-sm-6 p-md-4">
                <div className='flex flex-row justify-content-between'>
                    <div className="panel-fields p-mb-2 col">
                        <div className="p-mb-2 grid">
                            <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Household size: </div>
                            {isEditMode ? renderNumberOfPeopleField() : <div className="col text-900">{numberOfPeople}</div>}
                        </div>
                        <div className='divider my-3' />
                        <div className="p-mb-2 grid">
                            <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Has Pets: </div>
                            {isEditMode ? renderHasPetsField() : <div className="col text-900">{hasPets}</div>}
                        </div>
                        <div className='divider my-3' />
                        <div className="p-mb-2 grid">
                            <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Specific Requirements: </div>
                            {isEditMode ? renderSpecificRequirementsField() : <div className="col text-900">{specificRequirements}</div>}
                        </div>
                    </div>
                    <div className='flex-none'>
                        <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default HouseholdInformation;
