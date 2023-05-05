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
import { PaymentService } from '@/layout/service/PaymentService';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Chips } from 'primereact/chips';
import { LanguageService } from '@/layout/service/LanguageService';
import { CertificateService } from '@/layout/service/CertificateService';

const FooterButtons = ({ handleNextStep, handlePreviousStep }) => {

    return (
        <div className="flex flex-wrap justify-content-between gap-2 mt-4">
            <Button
                label="Previous"
                icon="pi pi-angle-left"
                className="p-button-text p-button-plain p-mt-2"
                onClick={handlePreviousStep}
            />
            <Button
                label="Next"
                icon="pi pi-angle-right"
                className="p-button-text p-button-plain p-mt-2"
                onClick={handleNextStep}
            />
        </div>
    );
};


const WorkerInformationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const [checked, setChecked] = useState(false);
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState(null);

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredSvcOptions;

            if (!event.query.trim().length) {
                _filteredSvcOptions = [...services];
            } else {
                _filteredSvcOptions = services.filter((service) => {
                    return service.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredServices(_filteredSvcOptions);
        }, 250);
    };

    useEffect(() => {
        // Replace this with code to fetch services from your backend
        const svcData = [
            { id: 1, name: "Child Care" },
            { id: 2, name: "Elder Care" },
            { id: 3, name: "Pet Care" },
            { id: 4, name: "House Services" },
        ];

        setServices(svcData);
    }, []);


    return (
        <div>
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="servicesOFfered" className="block text-900 font-medium mb-2">Service Offered</label>
                    <AutoComplete
                        id="servicesOffered"
                        field="name"
                        multiple
                        dropdown
                        virtualScrollerOptions={{ itemSize: 38 }}
                        value={formik.values.servicesOffered}
                        suggestions={filteredServices}
                        completeMethod={search}
                        onChange={formik.handleChange}
                        itemTemplate={(option) => (
                            <div style={{ marginRight: "10px", display: "inline-block" }}>
                                {option.name}
                            </div>
                        )}
                    />
                    {getFormErrorMessage('servicesOffered')}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="availability" className="block text-900 font-medium mb-2">Availability</label>
                    <InputText {...props.formik.getFieldProps('availability')} id="availability" type="text" placeholder="Enter your availability" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('availability') })} />
                    {getFormErrorMessage('availability')}
                </div>
                <div className="field col-12">
                    <label htmlFor="bio" className="block text-900 font-medium mb-2">Bio</label>
                    <InputTextarea {...props.formik.getFieldProps('bio')} id="bio" type="text" placeholder="Enter your bio" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('bio') })} style={{ width: '100%', height: '200px' }} />
                    {getFormErrorMessage('bio')}
                </div>
            </div>
            <FooterButtons handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />
        </div>
    )
}


const ExperienceStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const [checked, setChecked] = useState(false);
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;


    return (
        <div>
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-4">
                    <label htmlFor="hourlyRate" className="block text-900 font-medium mb-2">Hourly Rate</label>
                    <InputNumber id='hourlyRate' className='mb-3' inputId="hourlyRate" value={formik.values.hourlyRate} onValueChange={formik.handleChange} showButtons mode="currency" currency="PHP" />
                </div>
                <div className="field col-12 md:col-8">
                    <label htmlFor="skills" className="block text-900 font-medium mb-2">Additional Skills</label>
                    <Chips
                        value={formik.values.skills}
                        id="skills"
                        type="text"
                        placeholder="E.g. First Aid, Teaching, etc."
                        className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('skills') })}
                        onChange={formik.handleChange}
                    />
                    {getFormErrorMessage('skills')}
                </div>
                <label htmlFor="experience" className="block text-900 font-medium mb-2">Experience</label>
                <InputTextarea
                    {...props.formik.getFieldProps('workExperience')}
                    id="experience"
                    type="text"
                    placeholder="Enter your experience"
                    className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('workExperience') })}
                    style={{ width: '100%', height: '200px' }}
                />
                {getFormErrorMessage('workExperience')}
            </div>
            <FooterButtons handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />
        </div>

    )
}

function MultipleLanguageOpt({ formik }) {
    const [languages, setLanguages] = useState([]);
    const [filteredLanguages, setFilteredLanguages] = useState(null);

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredLanguages;

            if (!event.query.trim().length) {
                _filteredLanguages = [...languages];
            } else {
                _filteredLanguages = languages.filter((language) => {
                    return language.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredLanguages(_filteredLanguages);
        }, 250);
    };

    // retrieve languages from backend
    useEffect(() => {
        LanguageService.getLanguages().then((data) => setLanguages(data));
        // console.log(languages);
    }, []);

    return (
        <AutoComplete
            id="languages"
            field="name"
            multiple
            dropdown
            virtualScrollerOptions={{ itemSize: 38 }}
            value={formik.values.languages}
            suggestions={filteredLanguages}
            completeMethod={search}
            onChange={formik.handleChange}
        />
    );
}

function MultipleCertificationOpt({ formik }) {
    const [cert, setCert] = useState([]);
    const [filteredCert, setFilteredCert] = useState(null);

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredCert;

            if (!event.query.trim().length) {
                _filteredCert = [...cert];
            } else {
                _filteredCert = cert.filter((certificate) => {
                    return certificate.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredCert(_filteredCert);
        }, 250);
    };

    // retrieve certifications from backend
    useEffect(() => {
        CertificateService.getCertificates().then((data) => setCert(data));
    }, []);

    return (
        <AutoComplete
            id="certifications"
            field="name"
            multiple
            dropdown
            virtualScrollerOptions={{ itemSize: 38 }}
            value={formik.values.certifications}
            suggestions={filteredCert}
            completeMethod={search}
            onChange={formik.handleChange}
        />
    );
}

const BackgroundStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const [checked, setChecked] = useState(false);
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;


    const educItems = [
        { name: 'High School', value: 'High School' },
        { name: 'College', value: 'College' },
        { name: 'Vocational', value: 'Vocational' },
        { name: 'Post Graduate', value: 'Post Graduate' },
    ];

    return (
        <div>
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-8 md:col-offset-2">
                    <label htmlFor="languages" className="block text-900 font-medium mb-2">Languages</label>
                    <MultipleLanguageOpt formik={formik} />
                    {getFormErrorMessage('languages')}
                    <label htmlFor="education" className="block text-900 font-medium mb-2">Certifications</label>
                    <MultipleCertificationOpt formik={formik} />
                    {getFormErrorMessage('certifications')}
                    <label htmlFor="education" className="block text-900 font-medium mb-2">Education</label>
                    <Dropdown 
                        value={formik.values.education} 
                        onChange={(e) => formik.setFieldValue('education', e.value)}
                        options={educItems} 
                        optionLabel="name"
                        placeholder="Select a Education" 
                        className="w-full" 
                    />
                    {getFormErrorMessage('education')}
                </div>
            </div>
            <FooterButtons handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />
        </div>

    )
}

const HouseholdInformationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
    const [checked, setChecked] = useState(false);
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;


    return (
        <div>
            <label htmlFor="householdSize" className="block text-900 font-medium mb-2">Household Size</label>
            <InputText {...props.formik.getFieldProps('householdSize')} id="householdSize" type="text" placeholder="Enter you household size" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('householdSize') })} />
            {getFormErrorMessage('householdSize')}

            <label htmlFor="hasPets" className="block text-900 font-medium mb-2">Has Pets</label>
            {/* <InputText {...props.formik.getFieldProps('hasPets')} id="hasPets" type="text" placeholder="Enter yes or no" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('hasPets') })} /> */}
            <InputSwitch
                id="hasPets"
                name="hasPets"
                checked={formik.values.hasPets}
                onChange={(e) => {
                    formik.setFieldValue('hasPets', e.value);
                }}
                className={classNames({ 'p-invalid': isFormFieldInvalid('hasPets') })}
            />
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
    const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState(null);
    const [options, setOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredLanguages;

            if (!event.query.trim().length) {
                _filteredLanguages = [...payments];
            }
            else {
                _filteredLanguages = payments.filter((payment) => {
                    return payment.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredPayments(_filteredLanguages);
        }, 250);
    }

    useEffect(() => {
        PaymentService.getPaymentMethods().then((data) => setPayments(data));
        PaymentService.getFrequencyOfPayments().then((data) => setOptions(data));
    }, []);

    const handleSelectedPaymentChange = (e) => {
        formik.setFieldValue('paymentMethods', e.value);
    }

    const handleSelectedFrequencyChange = (e) => {
        formik.setFieldValue('paymentFrequency', e.value);
    }

    return (
        <div>
            <label htmlFor="paymentMethods" className="block text-900 font-medium mb-2">Payment Methods</label>
            <div className='p-fluid'>
                <AutoComplete
                    placeholder='Select preferred mode of payment'
                    value={formik.values.paymentMethods}
                    field="name" multiple dropdown
                    virtualScrollerOptions={{ itemSize: 38 }}
                    suggestions={filteredPayments}
                    completeMethod={search}
                    onChange={handleSelectedPaymentChange}
                />
            </div>
            {getFormErrorMessage('paymentMethods')}

            <label htmlFor="paymentFrequency" className="block text-900 font-medium mb-2">Preferred Frequency of Pay</label>
            <div className='p-fluid'>
                <Dropdown
                    placeholder="Select Frequency of Pay"
                    value={formik.values.paymentFrequency}
                    id="paymentFrequency"
                    options={options.map(option => ({ label: option.name, value: option.name }))}
                    onChange={handleSelectedFrequencyChange}
                />
            </div>
            {getFormErrorMessage('paymentFrequency')}

            <div className="flex flex-wrap justify-content-between gap-2 mt-4">
                <Button label="Back" className='' icon="pi pi-arrow-left" iconPos="left" onClick={handlePreviousStep} />
                <Button label="Next" className='' icon="pi pi-arrow-right" iconPos="right" onClick={handleNextStep} />
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
                {/* {getFormErrorMessage('bio')} */}
            </div>

            <div className=''>
                <label htmlFor="" className="block text-900 font-medium mb-1">Upload a government-issued ID</label>
                <p htmlFor="" className="block text-500 font-small mb-2">Provide proof of identity</p>
                <FileUpload name="personalPhoto" url={'/api/upload'} accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop an image of your id here.</p>} />
                {/* {getFormErrorMessage('bio')} */}
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
    WorkerInformationStep,
    ExperienceStep,
    BackgroundStep,
    VerificationStep
];

export default setupSteps;