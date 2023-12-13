import React, { useState, useRef, useEffect } from "react";
import EditButton from "@/layout/components/worker/information/subcomp/EditButton";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useFormik } from "formik";
import { Chip } from "primereact/chip";
import { AutoComplete } from "primereact/autocomplete";
import { CertificateService } from "@/layout/service/CertificateService";
import { Dropdown } from "primereact/dropdown";
import { EducationService } from "@/layout/service/EducationService";
import { LanguageService } from "@/layout/service/LanguageService";
import { ConfigService } from "@/layout/service/ConfigService";

const BackgroundInformation = ({ session, worker }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [languagesOptions, setLanguagesOptions] = useState([]);
  const [certificatesOptions, setCertificatesOptions] = useState([]);
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      languages: worker.languages,
      certifications: worker.certifications,
      education: worker.education,
    },
    onSubmit: async (values) => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      try {
        const response = await axios({
          method: "patch",
          data: { ...values, uuid: session.user.uuid },
          withCredentials: true,
          url: `${serverUrl}/worker/update-info/background`,
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

  useEffect(() => {
    const fetchLanguageAndCertConfig = async () => {
      const response = await ConfigService.getConfig(
        "Languages",
        "kasambahay_info"
      );

      if (response.status === 200) {
        const languages = response.data.config_value;
        const formattedLanguages = languages.split(",");
        setLanguagesOptions(formattedLanguages);
      }

      const response2 = await ConfigService.getConfig(
        "Certifications",
        "kasambahay_info"
      );

      if (response2.status === 200) {
        const certificates = response2.data.config_value;
        const formattedCertificates = certificates.split(",");
        setCertificatesOptions(formattedCertificates);
      }
    };

    fetchLanguageAndCertConfig();
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const SelectEducationLevel = ({ formik }) => {
    const [educItems, setEducItems] = useState([]);

    useEffect(() => {
      EducationService.getEducationLevels().then((data) => setEducItems(data));
    }, []);

    return (
      <div className="p-field">
        <Dropdown
          value={formik.values.education}
          onChange={(e) => formik.setFieldValue("education", e.value)}
          options={educItems}
          optionLabel="name"
          placeholder="Select a Education"
          className="w-full"
        />
      </div>
    );
  };

  function MultipleCertificationOpt({
    formik,
    isEditMode,
    certificatesOptions,
  }) {
    const [certificates, setCertificates] = useState(
      certificatesOptions.map((cert) => ({ name: cert }))
    );
    const [filteredCertificates, setFilteredCertificates] = useState(null);

    const search = (event) => {
      // Timeout to emulate a network connection
      setTimeout(() => {
        let _filteredCertsOptions;

        if (!event.query.trim().length) {
          _filteredCertsOptions = [...certificates];
        } else {
          _filteredCertsOptions = certificates.filter((certificate) => {
            return certificate.name
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }

        setFilteredCertificates(_filteredCertsOptions);
      }, 250);
    };

    // useEffect(() => {
    //   CertificateService.getCertificates().then((data) =>
    //     setCertificates(data)
    //   );
    // }, []);

    return (
      <>
        {isEditMode ? (
          <AutoComplete
            id="certifications"
            field="name"
            multiple
            dropdown
            virtualScrollerOptions={{ itemSize: 38 }}
            value={formik.values.certifications}
            suggestions={filteredCertificates}
            completeMethod={search}
            onChange={formik.handleChange}
          />
        ) : (
          <div className="p-mt-2 flex flex-wrap align-items-center">
            {/* {console.log(formik.values.certifications)} */}
            {formik.values.certifications &&
              formik.values.certifications.map((certificate, index) => (
                <Chip
                  key={index}
                  label={certificate.name}
                  className="mr-1 mb-1"
                />
              ))}
          </div>
        )}
      </>
    );
  }

  function MultipleLanguagesOpt({ formik, isEditMode, languagesOptions }) {
    const [languages, setLanguages] = useState(
      languagesOptions.map((lang) => ({ name: lang }))
    );
    const [filteredLanguages, setFilteredLanguages] = useState(null);

    const search = (event) => {
      // Timeout to emulate a network connection
      setTimeout(() => {
        let _filteredLangsOptions;

        if (!event.query.trim().length) {
          _filteredLangsOptions = [...languages];
        } else {
          _filteredLangsOptions = languages.filter((language) => {
            return language.name
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }

        setFilteredLanguages(_filteredLangsOptions);
      }, 250);
    };

    // useEffect(() => {
    //   LanguageService.getLanguages().then((data) => setLanguages(data));
    // }, []);

    return (
      <>
        {isEditMode ? (
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
        ) : (
          <div className="p-mt-2 flex flex-wrap align-items-center">
            {/* {console.log(formik.values.languages)} */}
            {formik.values.languages &&
              formik.values.languages.map((language, index) => (
                <Chip key={index} label={language.name} className="mr-1 mb-1" />
              ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-row justify-content-between">
      <Toast ref={toast} />
      <div className="panel-fields p-mb-2 grid">
        <div className="col-12 grid align-items-center">
          <div className="flex align-items-center w-3 col-fixed text-500 font-medium">
            Education Level:{" "}
          </div>
          <div className="col">
            {isEditMode ? (
              <SelectEducationLevel formik={formik} />
            ) : (
              <div className="col text-900">{formik.values.education}</div>
            )}
          </div>
        </div>
        <div className="col-12 grid align-contents-center">
          <div className="flex align-items-center w-3 col-fixed text-500 font-medium">
            Language/Dailect:{" "}
          </div>
          <div className="col">
            <MultipleLanguagesOpt
              formik={formik}
              isEditMode={isEditMode}
              languagesOptions={languagesOptions}
            />
          </div>
        </div>
        <div className="col-12 grid align-contents-center">
          <div className="flex align-items-center w-3 col-fixed text-500 font-medium">
            Certifications:{" "}
          </div>
          <div className="col">
            <MultipleCertificationOpt
              formik={formik}
              isEditMode={isEditMode}
              certificatesOptions={certificatesOptions}
            />
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

export default BackgroundInformation;
