import jobCreateSteps from "@/layout/components/employer/worker-search/booking-request/steps/jobCreateSteps";
import { useRouter } from "next/router";
import { Divider } from "primereact/divider";
import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";

const PostCreateSteps = ({
  toast,
  currentStep,
  setCurrentStep,
  isFormFieldInvalid,
  getFormErrorMessage,
  formik,
  setIsPostEditMode,
  isPostEditMode,
  livingArrangementOptions,
}) => {
  const router = useRouter();
  const stepsItems = [
    {
      label: "Type of Service",
    },
    {
      label: "Job Type",
    },
    {
      label: "Job Schedule",
    },
    {
      label: "Additional Details",
    },
  ];

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCancelBtn = () => {
    // if formik has no values, redirect to previous page
    if (!formik.dirty) {
      router.back();

      // else if it has values, change isPostEditMode to true
    } else {
      setIsPostEditMode(false);
    }
  };

  const StepComponent = jobCreateSteps[currentStep];

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card w-12 lg:w-12 mx-auto">
          <form>
            <div>
              {/* <Toast ref={toast} /> */}
              <Steps
                className="mx-auto w-10"
                model={stepsItems}
                aria-expanded="true"
                activeIndex={currentStep}
                pt={{
                  label: {
                    className: "hidden md:block",
                  },

                  step: {
                    className: "mb-4 md:mb-0",
                  },
                }}
              />
              <Divider className="mx-auto w-10 mb-5" />
              {/* Display summary */}

              <div className="mx-auto w-10">
                <Toast ref={toast} />
                <StepComponent
                  isFormFieldInvalid={isFormFieldInvalid}
                  getFormErrorMessage={getFormErrorMessage}
                  currentStep={currentStep}
                  formik={formik}
                  //   onSubmit={onSubmit}
                  handleNextStep={handleNextStep}
                  handlePreviousStep={handlePreviousStep}
                  handleCancelBtn={handleCancelBtn}
                  livingArrangementOptions={livingArrangementOptions}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCreateSteps;
