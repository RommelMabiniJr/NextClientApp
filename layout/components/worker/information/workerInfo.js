import React, { useState, useRef, useEffect } from "react";
import EditButton from "@/layout/components/worker/information/subcomp/EditButton";
import axios from "axios";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { useFormik } from "formik";
import { Chip } from "primereact/chip";
import { AutoComplete } from "primereact/autocomplete";
import { JobsService } from "@/layout/service/JobsService";
import { Divider } from "primereact/divider";

const WorkerInformation = ({ session, worker }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      servicesOffered: worker.servicesOffered,
      availability: worker.availability,
      bio: worker.bio,
    },
    onSubmit: async (values) => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      try {
        // console.log(values);
        const response = await axios({
          method: "patch",
          data: { ...values, uuid: session.user.uuid },
          withCredentials: true,
          url: `${serverUrl}/worker/update-info/basics`,
        });

        // console.log(response.data);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Worker information Updated!",
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

  const renderAvailabilityField = () => {
    return (
      <div className="p-field">
        <InputTextarea
          autoResize
          className="w-full"
          id="availability"
          value={formik.values.availability}
          onChange={formik.handleChange}
        />
      </div>
    );
  };

  function MultipleServicesOpt({ formik, isEditMode }) {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState(null);

    const search = (event) => {
      // Timeout to emulate a network connection
      setTimeout(() => {
        let _filteredServiceOptions;

        if (!event.query.trim().length) {
          _filteredServiceOptions = [...services];
        } else {
          _filteredServiceOptions = services.filter((service) => {
            return service.service_name
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }

        setFilteredServices(_filteredServiceOptions);
      }, 250);
    };

    useEffect(() => {
      JobsService.getServices().then((data) => setServices(data));
    }, []);

    return (
      <>
        {isEditMode ? (
          <AutoComplete
            id="servicesOffered"
            field="service_name"
            multiple
            dropdown
            virtualScrollerOptions={{ itemSize: 38 }}
            value={formik.values.servicesOffered}
            suggestions={filteredServices}
            completeMethod={search}
            onChange={formik.handleChange}
          />
        ) : (
          <div className="p-mt-2 flex flex-wrap">
            {/* {console.log(formik.values.servicesOffered)} */}
            {formik.values.servicesOffered &&
              formik.values.servicesOffered.map((service, index) => (
                <Chip
                  key={index}
                  label={service.service_name}
                  className="mr-1 mb-1"
                />
              ))}
          </div>
        )}
      </>
    );
  }

  const renderBioField = () => {
    return (
      <div className="p-field">
        <InputTextarea
          autoResize
          className="w-full"
          id="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-row justify-content-between">
      <Toast ref={toast} />
      <div className="panel-fields p-mb-2 grid gap-3">
        <div className="col-6">
          <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">
            Bio:{" "}
          </div>
          {isEditMode ? (
            renderBioField()
          ) : (
            <div className="col text-900">{formik.values.bio}</div>
          )}
        </div>
        <Divider layout="vertical" />
        <div className="col-5 grid gap-3">
          <div className="col-12">
            <div className="text-500 font-medium">Services Offered: </div>
            <div className="col">
              <MultipleServicesOpt formik={formik} isEditMode={isEditMode} />
            </div>
          </div>
          <div className="col-12">
            <div className="text-500 font-medium">Availability: </div>
            <div className="col">
              {isEditMode ? (
                renderAvailabilityField()
              ) : (
                <div className="col text-900">{formik.values.availability}</div>
              )}
            </div>
          </div>
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
  );
};

export default WorkerInformation;
