import EmployerNavbar from "@/layout/EmployerNavbar";
import Footer from "@/layout/Footer";
import BookRequest from "@/layout/components/employer/worker-search/booking-request/BookRequest";
import PostCreateSteps from "@/layout/components/employer/worker-search/booking-request/PostCreateSteps";
import { ConfigService } from "@/layout/service/ConfigService";
import { UserService } from "@/layout/service/UserService";
import { directHireValidate } from "@/lib/validators/directHireValidator";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BookRequestPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { workerId } = router.query;
  const [worker, setWorker] = useState({});
  const [isPostEditMode, setIsPostEditMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [jobDetails, setJobDetails] = useState({});

  const [jobTitleMaxLength, setJobTitleMaxLength] = useState(10);
  const [jobDescriptionMaxLength, setJobDescriptionMaxLength] = useState(10);
  const [livingArrangementOptions, setLivingArrangementOptions] = useState([]);

  const handleSignOut = () => {
    signOut();
  };

  const handleConfirmJobDetails = async (values) => {
    console.log(values);
    setJobDetails(values);
    setIsPostEditMode(false);
  };

  const handleBookWorker = async (values) => {
    // empty for now
  };

  const handleEditJobDetails = () => {
    setCurrentStep(0);
    setIsPostEditMode(true);
  };

  const formik = useFormik({
    initialValues: {
      serviceId: "",
      jobTitle: "",
      jobType: "",
      livingArrangement: "",
      jobDescription: "",
      jobStartDate: "",
      jobEndDate: "",
      jobStartTime: "",
      jobEndTime: "",
    },
    validate: (values) =>
      directHireValidate(values, jobTitleMaxLength, jobDescriptionMaxLength),
    onSubmit: handleConfirmJobDetails,
  });

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  useEffect(() => {
    // get worker information for booking
    if (!workerId) return;

    const fetchWorker = async () => {
      console.log(workerId);
      const response = await UserService.getWorkerInfoSimple(workerId);

      console.log(response);
      if (response) {
        setWorker(response);
      }
    };

    // get job title and description max length
    const fetchJobConfig = async () => {
      const titleResponse = await ConfigService.getConfig(
        "Job Title",
        "job_posting"
      );

      if (titleResponse.status === 200) {
        setJobTitleMaxLength(titleResponse.data.config_value);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          life: 3000,
        });
      }

      const descriptionResponse = await ConfigService.getConfig(
        "Job Description",
        "job_posting"
      );

      if (descriptionResponse.status === 200) {
        setJobDescriptionMaxLength(descriptionResponse.data.config_value);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          life: 3000,
        });
      }

      const livingArrangementResponse = await ConfigService.getConfig(
        "Living Arrangement",
        "job_posting"
      );

      if (livingArrangementResponse.status === 200) {
        setLivingArrangementOptions(
          livingArrangementResponse.data.config_value.split(",")
        );
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          life: 3000,
        });
      }
    };

    fetchJobConfig();

    fetchWorker();
  }, [workerId]);

  if (!session) {
    return <div>loading...</div>;
  }

  return (
    <div className="bg-white">
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="pb-6">
        {isPostEditMode ? (
          <PostCreateSteps
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            // toast={toast}
            isFormFieldInvalid={isFormFieldInvalid}
            getFormErrorMessage={getFormErrorMessage}
            formik={formik}
            isPostEditMode={isPostEditMode}
            setIsPostEditMode={setIsPostEditMode}
            livingArrangementOptions={livingArrangementOptions}
          />
        ) : (
          <BookRequest
            session={session}
            formik={formik}
            jobDetails={jobDetails}
            worker={worker}
            workerId={workerId}
            onBook={handleBookWorker}
            onEditJobDetails={handleEditJobDetails}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookRequestPage;
