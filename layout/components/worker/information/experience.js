import React, { useState, useRef, useEffect } from "react";
import EditButton from "@/layout/components/worker/information/subcomp/EditButton";
import axios from "axios";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { useFormik } from "formik";
import { Chip } from "primereact/chip";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
import { Chips } from "primereact/chips";
import { ConfigService } from "@/layout/service/ConfigService";
import { AutoComplete } from "primereact/autocomplete";

const ExperienceInformation = ({ session, worker }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [rateRange, setRateRange] = useState([0, 0]);
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      workExperience: worker.work_experience,
      hourlyRate: worker.hourly_rate,
      skills: worker.skills,
    },
    onSubmit: async (values) => {
      const skillsString = values.skills.join(",");
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      try {
        const response = await axios({
          method: "patch",
          data: { ...values, skillsString, uuid: session.user.uuid },
          withCredentials: true,
          url: `${serverUrl}/worker/update-info/experience`,
        });

        console.log(response.data);

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
    const fetchSkillsAndRateConfig = async () => {
      const response = await ConfigService.getConfig(
        "Skills",
        "kasambahay_info"
      );

      if (response.status === 200) {
        const skills = response.data.config_value;
        const formattedSkills = skills.split(",");
        setSkillsOptions(formattedSkills);
      }

      const response2 = await ConfigService.getConfig(
        "Rates",
        "kasambahay_info"
      );

      if (response2.status === 200) {
        const rateRange = response2.data.config_value;
        const formattedRateRange = rateRange.split(",");
        setRateRange(formattedRateRange);
      }
    };

    fetchSkillsAndRateConfig();
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const renderHourlyRateField = () => {
    return (
      <div className="p-field">
        <InputNumber
          id="hourlyRate"
          className="w-full"
          inputId="hourlyRate"
          value={formik.values.hourlyRate}
          onValueChange={formik.handleChange}
          showButtons
          min={rateRange[0]}
          mode="currency"
          currency="PHP"
        />
      </div>
    );
  };

  function MultipleSkillsOpt({ formik, isEditMode, skillsOpt }) {
    const [skillsOptions, setSkillsOptions] = useState(skillsOpt);
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
      <>
        {console.log(formik.values.skills)}
        {isEditMode ? (
          <AutoComplete
            id="skills"
            multiple
            dropdown
            virtualScrollerOptions={{ itemSize: 38 }}
            value={formik.values.skills}
            suggestions={filteredOptions}
            completeMethod={search}
            onChange={formik.handleChange}
          />
        ) : (
          <div className="p-mt-2 flex flex-wrap">
            {formik.values.skills &&
              formik.values.skills.map((skill, index) => (
                <Chip key={index} label={skill} className="mr-1 mb-1" />
              ))}
          </div>
        )}
      </>
    );
  }

  const renderExperienceField = () => {
    return (
      <div className="p-field">
        <InputTextarea
          autoResize
          className="w-full"
          id="workExperience"
          value={formik.values.workExperience}
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
            Experience:{" "}
          </div>
          {isEditMode ? (
            renderExperienceField()
          ) : (
            <div className="col text-900">{formik.values.workExperience}</div>
          )}
        </div>
        <Divider layout="vertical" />
        <div className="col-5 grid gap-3">
          <div className="col-12">
            <div className="text-500 font-medium">Pay Rate: </div>
            <div className="col">
              {isEditMode ? (
                renderHourlyRateField()
              ) : (
                <div className="col text-900">
                  ₱ {formik.values.hourlyRate.toLocaleString()}
                </div>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="text-500 font-medium">Additional Skills: </div>
            <div className="col">
              <MultipleSkillsOpt
                formik={formik}
                isEditMode={isEditMode}
                skillsOpt={skillsOptions}
              />
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

export default ExperienceInformation;
