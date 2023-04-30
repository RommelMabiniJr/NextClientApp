import React, { useState, useEffect } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { PaymentService } from '@/layout/service/PaymentService';
import { InputTextarea } from 'primereact/inputtextarea';

const HouseholdInformationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const [checked, setChecked] = useState(false);
    const { isFormFieldInvalid, getFormErrorMessage } = props;


    return (
        <div>
            <label htmlFor="householdSize" className="block text-900 font-medium mb-2">Household Size</label>
            <InputText {...props.formik.getFieldProps('householdSize')} id="householdSize" type="text" placeholder="Enter you household size" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('householdSize') })} />
            {getFormErrorMessage('householdSize')}

            <label htmlFor="hasPets" className="block text-900 font-medium mb-2">Has Pets</label>
            <InputText {...props.formik.getFieldProps('hasPets')} id="hasPets" type="text" placeholder="Enter yes or no" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('hasPets') })} />
            {getFormErrorMessage('hasPets')}

            <label htmlFor="specificNeeds" className="block text-900 font-medium mb-2">Specific Needs</label>
            <InputText {...props.formik.getFieldProps('specificNeeds')} id="specificNeeds" type="text" placeholder="Enter any specific needs in mind" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('specificNeeds') })} />
            {getFormErrorMessage('specificNeeds')}

            <div className="flex flex-wrap justify-content-end gap-2 mt-4">
                <Button label="Next" className='align-content-center' icon="pi pi-arrow-right" iconPos="right" onClick={handleNextStep} />
            </div>

        </div>
    );

}

const PaymentStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const { isFormFieldInvalid, getFormErrorMessage } = props;
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState(null);
    const [options, setOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredPayOptions;

            if (!event.query.trim().length) {
                _filteredPayOptions = [...payments];
            }
            else {
                _filteredPayOptions = payments.filter((payment) => {
                    return payment.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredPayments(_filteredPayOptions);
        }, 250);
    }

    useEffect(() => {
        PaymentService.getPaymentMethods().then((data) => setPayments(data));
        PaymentService.getFrequencyOfPayments().then((data) => setOptions(data));
    }, []);

    return (
        <div>
            <label htmlFor="paymentMethods" className="block text-900 font-medium mb-2">Payment Methods</label>
            <div className='p-fluid'>
                <AutoComplete placeholder='Select preferred mode of payment' field="name" multiple dropdown virtualScrollerOptions={{ itemSize: 38 }} value={selectedPayment} suggestions={filteredPayments} completeMethod={search} onChange={(e) => setSelectedPayment(e.value)} />
            </div>
            {getFormErrorMessage('paymentMethods')}

            <label htmlFor="paymentFrequency" className="block text-900 font-medium mb-2">Preferred Frequency of Pay</label>
            <div className='p-fluid'>
                <Dropdown id="paymentFrequency" value={selectedOption} options={options.map(option => ({ label: option.name, value: option.name }))} onChange={(e) => setSelectedOption(e.value)} placeholder="Select Frequency of Pay" />
            </div>
            {getFormErrorMessage('paymentFrequency')}

            <div className="flex flex-wrap justify-content-between gap-2 mt-4">
                <Button label="Back" className='' icon="pi pi-arrow-left" iconPos="left" onClick={handlePreviousStep} />
                <Button label="Next" className='' icon="pi pi-arrow-right" iconPos="right" onClick={handleNextStep} />
            </div>
        </div>
    );
}

const AdditionalStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

    return (
        <div>
            <label htmlFor="bio" className="block text-900 font-medium mb-2">Bio </label>
            <InputTextarea style={{ width: '100%', height: '200px' }} {...props.formik.getFieldProps('bio')} id="bio" type="text" placeholder="Create a bio" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('bio') })} />
            {getFormErrorMessage('bio')}

            <div className="flex flex-wrap justify-content-between gap-2 mt-4">
                <Button label="Back" className='' icon="pi pi-arrow-left" iconPos="left" onClick={handlePreviousStep} />
                <Button label="Skip" className='' icon="pi pi-arrow-right" iconPos="right" onClick={handleNextStep} />
            </div>
        </div>
    );
}



const VerificationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

    return (
        <div>
            <div className='mb-4'>
                <label htmlFor="personalPhoto" className="block text-900 font-medium mb-2">Upload a picture </label>
                <FileUpload name="personalPhoto" url={'/api/upload'} accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop a picture of yourself here.</p>} />
                {getFormErrorMessage('bio')}
            </div>

            <div className=''>
                <label htmlFor="" className="block text-900 font-medium mb-1">Upload a government-issued ID</label>
                <p htmlFor="" className="block text-500 font-small mb-2">Provide proof of identity</p>
                <FileUpload name="personalPhoto" url={'/api/upload'} accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop an image of your id here.</p>} />
                {getFormErrorMessage('bio')}
            </div>

            <div className="flex flex-wrap justify-content-between gap-2 mt-4">
                <Button label="Back" className='' icon="pi pi-arrow-left" iconPos="left" onClick={handlePreviousStep} />
                <Button label="Confirm" className='' icon="pi pi-arrow-right" iconPos="right" onClick={props.formik.handleSubmit} />
            </div>
        </div>
    );
};

// 
const setupSteps = [
    HouseholdInformationStep,
    PaymentStep,
    AdditionalStep,
    VerificationStep
];

export default setupSteps;