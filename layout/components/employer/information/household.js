import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import EditButton from "@/layout/components/employer/information/subcomp/EditButton";
import { useFormik } from "formik";
import axios from "axios";

const HouseholdInformation = ({ session, employer }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      householdSize: employer.householdSize,
      pets: employer.pets,
      specificNeeds: employer.specificNeeds,
    },
    onSubmit: async (values) => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

        const response = await axios({
          method: "patch",
          data: { ...values, uuid: session.user.uuid },
          withCredentials: true,
          url: `${serverUrl}/employer/update-info/household`,
        });

        console.log(response.data);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Employer information Updated!",
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
        {/* Render using radio button instead */}
        <div className="flex flex-wrap justify-content-center gap-3 mt-3">
          <div className="flex align-items-center">
            <Checkbox
              inputId="dog"
              name="pets"
              value={formik.values.pets.dog}
              onChange={(e) => {
                formik.setFieldValue("pets.dog", e.checked);
              }}
              checked={formik.values.pets.dog}
            />
            <label htmlFor="dog" className="ml-2">
              Dog
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="cat"
              name="pets"
              value={formik.values.pets.cat}
              onChange={(e) => {
                formik.setFieldValue("pets.cat", e.checked);
              }}
              checked={formik.values.pets.cat}
            />
            <label htmlFor="cat" className="ml-2">
              Cat
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="other"
              name="pets"
              value={formik.values.pets.otherPets}
              onChange={(e) => {
                formik.setFieldValue("pets.otherPets", e.checked);
              }}
              checked={formik.values.pets.otherPets}
            />
            <label htmlFor="other" className="ml-2">
              Other Pets
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderSpecificNeedsField = () => {
    return (
      <div className="p-field flex-1">
        <InputTextarea
          autoResize
          className="w-full"
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
      <div className="flex gap-4 flex-row justify-content-between">
        <div className="panel-fields p-mb-2 col">
          <div className="p-mb-2 grid">
            <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">
              Household Size:{" "}
            </div>
            {isEditMode ? (
              renderHouseholdSizeField()
            ) : (
              <div className="col text-900">{formik.values.householdSize}</div>
            )}
          </div>
          <div className="divider my-3" />
          <div className="p-mb-2 grid">
            <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">
              Pets in the Household:{" "}
            </div>
            {isEditMode ? (
              renderHasPetsField()
            ) : (
              <div className="flex text-900">
                {/* loop & conditionally renders the icon from the public folder based on the pets that are true*/}
                {Object.keys(formik.values.pets).map((pet) => {
                  if (formik.values.pets[pet]) {
                    return (
                      <div
                        key={pet}
                        className="flex flex-column justify-content-center mr-2"
                      >
                        <img
                          key={pet}
                          src={`/layout/pets/${pet}.png`}
                          alt={pet}
                          className="h-3rem w-3rem"
                        />
                        {/* <span className="ml-2">{pet}</span> */}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
          <div className="divider my-3" />
          <div className="p-mb-2 grid">
            <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">
              Specific Requirements:{" "}
            </div>
            {isEditMode ? (
              renderSpecificNeedsField()
            ) : (
              <div className="col text-900">{formik.values.specificNeeds}</div>
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

export default HouseholdInformation;
