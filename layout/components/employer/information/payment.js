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
  const [badgeOptions, setBadgeOptions] = useState([
    "Flexible Schedule Advocate",
    "Family-Oriented Workplace",
    "Skill Development Advocate",
    "Safety First",
    "Open Communication",
  ]);
  const [filteredBadges, setFilteredBadges] = useState(null);

  const searchBadge = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredBadgeOptions;

      if (!event.query.trim().length) {
        _filteredBadgeOptions = [...badgeOptions];
      } else {
        _filteredBadgeOptions = badgeOptions.filter((badge) => {
          return badge.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredBadges(_filteredBadgeOptions);
    }, 250);
  };

  return (
    <>
      {/* {console.log(payments)} */}
      {isEditMode ? (
        <AutoComplete
          id="badges"
          multiple
          dropdown
          virtualScrollerOptions={{ itemSize: 38 }}
          value={formik.values.badges}
          suggestions={filteredBadges}
          completeMethod={searchBadge}
          onChange={formik.handleChange}
        />
      ) : (
        <div className="p-mt-2">
          {formik.values.badges &&
            formik.values.badges.map((badge, index) => (
              <Chip key={index} label={badge} className="mr-1 mb-1" />
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

      // console.log(response.data);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Employer Preference information Updated!",
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
      badges: employer.badges,
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
            Badges:
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
