import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { classNames } from "primereact/utils";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import EditButton from "./components/infoComponents";
import { useFormik } from "formik";
import axios from "axios";

const ContactInformation = ({ session }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      phoneNumber: session.user.phone,
      email: session.user.email,
    },
    onSubmit: async (values) => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      try {
        const response = await axios({
          method: "patch",
          data: { ...values, uuid: session.user.uuid },
          withCredentials: true,
          url: `${serverUrl}/user/update-info`,
        });

        console.log(response.data);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "User information Updated!",
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
    },
  });

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const renderPhoneNumberField = () => {
    return (
      <div className="p-field">
        <InputText
          id="phoneNumber"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
        />
      </div>
    );
  };

  const renderEmailField = () => {
    return (
      <div className="p-field">
        <InputText
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
      </div>
    );
  };

  return (
    <div className="p-d-flex p-jc-between">
      <Toast ref={toast} />
      <div className="flex flex-row justify-content-between">
        <div className="panel-fields p-mb-2 col">
          <div className="p-mb-2 grid">
            <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">
              Phone:{" "}
            </div>
            {isEditMode ? (
              renderPhoneNumberField()
            ) : (
              <div className="col text-900">{formik.values.phoneNumber}</div>
            )}
          </div>
          <div className="divider my-3" />
          <div className="p-mb-2 grid">
            <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">
              Email:{" "}
            </div>
            {isEditMode ? (
              renderEmailField()
            ) : (
              <div className="col text-900">{formik.values.email}</div>
            )}
          </div>
        </div>

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

export default ContactInformation;
