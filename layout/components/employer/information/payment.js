import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Chip } from "primereact/chip";
import { PaymentService } from "@/layout/service/PaymentService";
import { useFormik } from "formik";
import axios from "axios";
import EditButton from "@/layout/components/employer/information/subcomp/EditButton";
import { Toast } from "primereact/toast";
import { ConfigService } from "@/layout/service/ConfigService";
import FormatHelper from "@/lib/formatHelper";

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
          return payment.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredPayments(_filteredPayOptions);
    }, 250);
  };

  useEffect(() => {
    PaymentService.getPaymentMethods().then((data) => setPayments(data));
    // console.log(payments);
  }, []);

  return (
    <>
      {/* {console.log(payments)} */}
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

export function FrequencyOfPayDropdown({ formik, isEditMode, freqOfPay }) {
  const [freqOptions, setFreqOptions] = useState([]);

  useEffect(() => {
    setFreqOptions(freqOfPay);
  }, [freqOfPay]);

  return (
    <>
      {isEditMode ? (
        <div className="p-field">
          <Dropdown
            id="paymentFrequency"
            value={formik.values.paymentFrequency}
            options={freqOptions}
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

const PaymentInformation = ({ session, employer }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [freqOfPay, setFreqOfPay] = useState([]);
  const toast = useRef(null);
  const formatHelper = FormatHelper();

  useEffect(() => {
    const fetchFreqOfPayConfig = async () => {
      const response = await ConfigService.getConfig(
        "Frequency of Payment",
        "employer_info"
      );

      if (response.status === 200) {
        const freqOfPay = response.data.config_value;

        const formattedFreqOfPay = formatHelper.stringToArray(freqOfPay);

        setFreqOfPay(formattedFreqOfPay);
      }
    };

    fetchFreqOfPayConfig();
  }, []);

  const onSubmit = async (values) => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    try {
      const response = await axios({
        method: "patch",
        data: { ...values, uuid: session.user.uuid },
        withCredentials: true,
        url: `${serverUrl}/employer/update-info/payment`,
      });

      console.log(response.data);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Employer Payment information Updated!",
        life: 3000,
      });

      toggleEditMode();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      paymentMethods: employer.paymentMethods,
      paymentFrequency: employer.paymentFrequency,
    },
    onSubmit: onSubmit,
  });

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const renderContent = () => {
    return (
      <>
        <div className="p-mb-2 grid">
          <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">
            Preferred Payment:
          </div>
          <div className="p-field">
            <MultiplePaymentOpt formik={formik} isEditMode={isEditMode} />
          </div>
        </div>
        <div className="divider my-3"></div>
        <div className="p-mb-2 grid">
          <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">
            Frequency of pay:
          </div>
          <div className="p-field">
            <FrequencyOfPayDropdown
              formik={formik}
              isEditMode={isEditMode}
              freqOfPay={freqOfPay}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="p-d-flex p-jc-between">
      <Toast ref={toast} />
      <div className="flex flex-row justify-content-between">
        <div className="p-mb-2 col">{renderContent()}</div>
        <div className="flex-none">
          <EditButton
            isEditMode={isEditMode}
            toggleEditMode={toggleEditMode}
            onSubmit={formik.handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentInformation;
