import React, { useState, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Chips } from "primereact/chips";
import { LanguageService } from "@/layout/service/LanguageService";
import { CertificateService } from "@/layout/service/CertificateService";
import ProfilePictureUpload from "../../shared/profilecapture";
import DocumentsUpload from "./documentUpload";

const FooterButtons = ({ handleNextStep, handlePreviousStep }) => {
  return (
    <div className="flex flex-wrap justify-content-between gap-2 mt-4">
      <Button
        label="Previous"
        icon="pi pi-angle-left"
        onClick={handlePreviousStep}
      />
      <Button label="Next" icon="pi pi-angle-right" onClick={handleNextStep} />
    </div>
  );
};

const WorkerInformationStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
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
          return service.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
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
          <label
            htmlFor="servicesOFfered"
            className="block text-900 font-medium mb-2"
          >
            Service Offered
          </label>
          <AutoComplete
            autoFocus
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
            className={classNames("w-full", {
              "p-invalid": isFormFieldInvalid("servicesOffered"),
            })}
          />
          {getFormErrorMessage("servicesOffered")}
        </div>
        <div className="field col-12 md:col-6">
          <label
            htmlFor="availability"
            className="block text-900 font-medium mb-2"
          >
            Availability
          </label>
          <InputText
            {...props.formik.getFieldProps("availability")}
            id="availability"
            type="text"
            placeholder="Enter your availability"
            className={classNames("w-full", {
              "p-invalid": isFormFieldInvalid("availability"),
            })}
          />
          {getFormErrorMessage("availability")}
        </div>
        <div className="field col-12">
          <label htmlFor="bio" className="block text-900 font-medium mb-2">
            Bio
          </label>
          <InputTextarea
            {...props.formik.getFieldProps("bio")}
            id="bio"
            type="text"
            placeholder="Enter your bio"
            className={classNames("w-full", {
              "p-invalid": isFormFieldInvalid("bio"),
            })}
            style={{ width: "100%", height: "200px" }}
          />
          {getFormErrorMessage("bio")}
        </div>
      </div>
      <div className="flex flex-wrap justify-content-end gap-2 mt-4">
        <Button
          type="button"
          label="Next"
          className=""
          icon="pi pi-angle-right"
          iconPos="right"
          onClick={() => {
            handleNextStep();
          }}
          disabled={
            formik.errors.bio ||
            formik.errors.servicesOffered ||
            formik.errors.availability
          }
        />
      </div>
    </div>
  );
};

const ExperienceStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const [checked, setChecked] = useState(false);
  const {
    isFormFieldInvalid,
    getFormErrorMessage,
    rateRange,
    skillsOptions,
    formik,
  } = props;

  const [filteredOptions, setFilteredOptions] = useState(null);

  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredSkillsOptions;

      if (!event.query.trim().length) {
        _filteredSkillsOptions = [...skillsOptions];
      } else {
        _filteredSkillsOptions = skillsOptions.filter((skill) => {
          return skill.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredOptions(_filteredSkillsOptions);
    }, 250);
  };

  return (
    <div>
      <div className="p-fluid formgrid grid">
        <div className="field col-12 md:col-4">
          <label
            htmlFor="hourlyRate"
            className="block text-900 font-medium mb-2"
          >
            Pay Rate
          </label>
          <InputNumber
            id="hourlyRate"
            inputId="hourlyRate"
            value={formik.values.hourlyRate}
            onValueChange={formik.handleChange}
            showButtons
            mode="currency"
            currency="PHP"
            min={rateRange[0]}
            className={classNames("mb-3", {
              "p-invalid": isFormFieldInvalid("hourlyRate"),
            })}
          />
          {getFormErrorMessage("hourlyRate")}
        </div>
        <div className="field col-12 md:col-8">
          <label htmlFor="skills" className="block text-900 font-medium mb-2">
            Additional Skills
          </label>
          <AutoComplete
            id="skills"
            multiple
            dropdown
            virtualScrollerOptions={{ itemSize: 38 }}
            value={formik.values.skills}
            suggestions={filteredOptions}
            completeMethod={search}
            onChange={formik.handleChange}
            className={classNames("mb-3", {
              "p-invalid": isFormFieldInvalid("skills"),
            })}
          />
          {getFormErrorMessage("skills")}
        </div>
        <label htmlFor="experience" className="block text-900 font-medium mb-2">
          Experience
        </label>
        <InputTextarea
          {...props.formik.getFieldProps("workExperience")}
          id="experience"
          type="text"
          placeholder="Enter your experience"
          className={classNames("w-full", {
            "p-invalid": isFormFieldInvalid("workExperience"),
          })}
          style={{ width: "100%", height: "200px" }}
        />
        {getFormErrorMessage("workExperience")}
      </div>
      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-angle-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          type="button"
          label="Next"
          className=""
          icon="pi pi-angle-right"
          iconPos="right"
          onClick={() => {
            handleNextStep();
          }}
          disabled={
            formik.errors.workExperience ||
            formik.errors.skills ||
            formik.errors.hourlyRate
          }
        />
      </div>
    </div>
  );
};

function MultipleLanguageOpt({ formik, languagesOptions, isFormFieldInvalid }) {
  const [languages, setLanguages] = useState(
    languagesOptions.map((language) => {
      return { name: language };
    })
  );
  const [filteredLanguages, setFilteredLanguages] = useState();

  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredLanguages;

      if (!event.query.trim().length) {
        _filteredLanguages = [...languages];
      } else {
        _filteredLanguages = languages.filter((language) => {
          return language.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredLanguages(_filteredLanguages);
    }, 250);
  };

  //   // retrieve languages from backend
  //   useEffect(() => {
  //     LanguageService.getLanguages().then((data) => setLanguages(data));
  //     // console.log(languages);
  //   }, []);

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
      className={classNames("mb-3", {
        "p-invalid": isFormFieldInvalid("languages"),
      })}
    />
  );
}

function MultipleCertificationOpt({
  formik,
  certificatesOptions,
  isFormFieldInvalid,
}) {
  const [cert, setCert] = useState(
    certificatesOptions.map((cert) => {
      return { name: cert };
    })
  );
  const [filteredCert, setFilteredCert] = useState(null);

  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredCert;

      if (!event.query.trim().length) {
        _filteredCert = [...cert];
      } else {
        _filteredCert = cert.filter((certificate) => {
          return certificate.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredCert(_filteredCert);
    }, 250);
  };

  // retrieve certifications from backend
  //   useEffect(() => {
  //     CertificateService.getCertificates().then((data) => setCert(data));
  //   }, []);

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
      className={classNames("mb-3", {
        "p-invalid": isFormFieldInvalid("certifications"),
      })}
    />
  );
}

const BackgroundStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const [checked, setChecked] = useState(false);
  const {
    isFormFieldInvalid,
    getFormErrorMessage,
    languagesOptions,
    certificatesOptions,
    formik,
  } = props;

  const educItems = [
    { name: "High School", value: "High School" },
    { name: "College", value: "College" },
    { name: "Vocational", value: "Vocational" },
    { name: "Post Graduate", value: "Post Graduate" },
  ];

  return (
    <div>
      <div className="p-fluid formgrid grid">
        <div className="field col-12">
          <label
            htmlFor="languages"
            className="block text-900 font-medium mb-2"
          >
            Languages
          </label>
          <MultipleLanguageOpt
            formik={formik}
            languagesOptions={languagesOptions}
            isFormFieldInvalid={isFormFieldInvalid}
          />
          {getFormErrorMessage("languages")}
          <label
            htmlFor="certifications"
            className="block text-900 font-medium mb-2"
          >
            Certifications
          </label>
          <MultipleCertificationOpt
            formik={formik}
            certificatesOptions={certificatesOptions}
            isFormFieldInvalid={isFormFieldInvalid}
          />
          {getFormErrorMessage("certifications")}
          <label
            htmlFor="education"
            className="block text-900 font-medium mb-2"
          >
            Education
          </label>
          <Dropdown
            value={formik.values.education}
            onChange={(e) => formik.setFieldValue("education", e.value)}
            options={educItems}
            optionLabel="name"
            placeholder="Select a Education"
            className={classNames("w-full", {
              "p-invalid": isFormFieldInvalid("email"),
            })}
          />
          {getFormErrorMessage("education")}
        </div>
      </div>
      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          type="button"
          label="Confirm"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            // formik.handleSubmit();
            handleNextStep();
          }}
          disabled={
            formik.errors.languages ||
            formik.errors.certifications ||
            formik.errors.education
          }
        />
      </div>
    </div>
  );
};

const VerificationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
  const [imageSrc, setImageSrc] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({
    resume: null,
    nbiClearance: null,
    barangayClearance: null,
    policeClearance: null,
  });

  const handleFileSelect = (file, documentType) => {
    setSelectedFiles({
      ...selectedFiles,
      [documentType]: file,
    });

    formik.setFieldValue(`documents.${documentType}`, file);
  };

  const handleCaptureImage = (imgFile, previewSrc) => {
    setImageSrc(previewSrc);
    setImageBlob(imgFile);
    formik.setFieldValue("profilePhoto", imgFile);
  };

  return (
    <div>
      <div className="mb-4">
        <label
          htmlFor="personalPhoto"
          className="block text-900 font-medium mb-2"
        >
          Profile Picture{" "}
        </label>
        <ProfilePictureUpload
          parentSrc={imageSrc}
          onCaptureImage={handleCaptureImage}
          formik={formik}
        />
        {getFormErrorMessage("profilePhoto")}
      </div>

      <div className="mb-4">
        <label
          htmlFor="personalPhoto"
          className="block text-900 font-medium mb-2"
        >
          Documents (Upload at least 1 document)
        </label>
        {/* <Button
          type="button"
          label="Show Docs"
          onClick={() => console.log(selectedFiles, imageSrc)}
        /> */}
        <DocumentsUpload
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
        />
        {getFormErrorMessage("profilePhoto")}
      </div>

      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          type="button"
          label="Confirm"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            formik.handleSubmit();
            // console.log(formik.values.profilePhoto);
          }}
          disabled={formik.errors.profilePhoto || formik.errors.documents}
        />
      </div>
    </div>
  );
};

const setupSteps = [
  WorkerInformationStep,
  ExperienceStep,
  BackgroundStep,
  VerificationStep,
];

export default setupSteps;
