import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { AutoComplete } from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { Chip } from 'primereact/chip';
import { PaymentService } from '@/layout/service/PaymentService';
import { useFormik } from 'formik';
import axios from 'axios';
import EditButton from './components/infoComponents';
import { Toast } from 'primereact/toast';

export function MultiplePaymentOpt({ formik, isEditMode }) {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState(null);
  
    const search = (event) => {
      // Timeout to emulate a network connection
      setTimeout(() => {
        let _filteredPayOptions;
  
        if (!event.query.trim().length) {
          _filteredPayOptions = [...payments];
        } else {
          _filteredPayOptions = payments.filter((payment) => {
            return payment.name.toLowerCase().startsWith(event.query.toLowerCase());
          });
        }
  
        setFilteredPayments(_filteredPayOptions);
      }, 250);
    };
  
    useEffect(() => {
      PaymentService.getPaymentMethods().then((data) => setPayments(data));
      console.log(payments);
    }, []);
  
    return (
      <>
        {isEditMode ? (
          <AutoComplete
            id="paymentMethods"
            field="name"
            multiple
            dropdown
            virtualScrollerOptions={{ itemSize: 38 }}
            value={formik.values.paymentMethods}
            suggestions={filteredPayments}
            completeMethod={search}
            onChange={formik.handleChange}
          />
        ) : (
          <div className="p-mt-2">
            {console.log(formik.values.paymentMethods)}
            {formik.values.paymentMethods &&
              formik.values.paymentMethods.map((payment, index) => (
                <Chip key={index} label={payment.name} className="mr-1 mb-1" />
              ))}
          </div>
        )}
      </>
    );
  }
  

export function FrequencyOfPayDropdown({ formik, isEditMode }) {
    const [options, setOptions] = useState([
      { name: 'Weekly' },
      { name: 'Bi-Weekly' },
      { name: 'Semi-Monthly' },
      { name: 'Monthly' },
    ]);
  
    useEffect(() => {
      PaymentService.getFrequencyOfPayments().then((data) => setOptions(data));
    }, []);
  
    return (
      <>
        {isEditMode ? (
          <div className="p-field">
            <Dropdown
              id="paymentFrequency"
              value={formik.values.paymentFrequency}
              options={options.map((option) => ({
                label: option.name,
                value: option.name,
              }))}
              onChange={formik.handleChange}
              placeholder="Select Frequency of Pay"
            />
          </div>
        ) : (
          <div className="col text-900">{formik.values.paymentFrequency}</div>
        )}
      </>
    );
  }
  


const PaymentInformation = ({session, employer}) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const toast = useRef(null);

    const onSubmit = async (values) => {
        try {
            const response = await axios({
                method: 'patch',
                data: { ...values, uuid: session.user.uuid },
                withCredentials: true,
                url: 'http://localhost:5000/employer/update-info/payment',
            });

            console.log(response.data);

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Employer Payment information Updated!',
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
    };

    const formik = useFormik({
        initialValues: {
            paymentMethods: employer.paymentMethods,
            paymentFrequency: employer.paymentFrequency,
        },
        onSubmit: onSubmit
    });

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const renderPrefferedPaymentField = () => {
        return (
            <div className="p-field">
                <MultiplePaymentOpt formik={formik} isEditMode={isEditMode} />
            </div>
        );
    };

    const renderRateOfPayField = () => {
        return (
            <div className="p-field">
                <FrequencyOfPayDropdown formik={formik} isEditMode={isEditMode} />
            </div>
        );
    };


    const renderContent = () => {
        return (
            <>
                <div className="p-mb-2 grid">
                    <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Preferred Payment:</div>
                    {renderPrefferedPaymentField()}
                </div>
                <div className='divider my-3'></div>
                <div className="p-mb-2 grid">
                    <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Frequency of pay:</div>
                    {renderRateOfPayField()}
                </div>
            </>
        );
    };

    return (
        <div className="p-d-flex p-jc-between">
            <Panel header="Payment Information" className="p-col-12 p-sm-6 p-md-4">
                <Toast ref={toast} />
                <div className='flex flex-row justify-content-between'>
                    <div className="p-mb-2 col">
                        {renderContent()}
                    </div>
                    <div className='flex-none'>
                        <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} onSubmit={formik.handleSubmit} />
                    </div>
                </div>
            </Panel>
        </div>

    );

};

export default PaymentInformation;
