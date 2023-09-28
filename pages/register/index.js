import Navbar from "../../layout/components/Navbar";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  createSlice,
  configureStore,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Steps } from "primereact/steps";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { SelectButton } from "primereact/selectbutton";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import axios from "axios";
import steps from "./components/steps";
import { registerValidate } from "@/lib/validate";
import Link from "next/link";

const initialState = {
  firstname: "",
  secondname: "",
  email: "",
  password: "",
  documents: [],
  loading: false,
  error: null,
  success: false,
};

export const registerWorker = createAsyncThunk(
  "worker/registerWorker",
  async (workerData, thunkAPI) => {
    try {
      const response = await axios.post("/api/worker/register", workerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    clearFields: (state) => {
      state.name = "";
      state.email = "";
      state.password = "";
      state.documents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerWorker.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.name = "";
        state.email = "";
        state.password = "";
        state.documents = [];
      })
      .addCase(registerWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.success = false;
      });
  },
});

const store = configureStore({
  reducer: registrationSlice.reducer,
});

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const router = useRouter();
  const toast = useRef(null);

  const items = [
    {
      label: "Personal",
    },
    {
      label: "Contact",
    },
    {
      label: "Location",
    },
    {
      label: "Security",
    },
  ];

  const options = [
    { label: "Worker", value: "domestic worker" },
    { label: "Employer", value: "household employer" },
  ];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      secondName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      city: "",
      barangay: "",
      street: "",
      user_type: "",
    },
    validate: registerValidate,
    onSubmit,
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

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        values,
        { withCredentials: true }
      );
      console.log(response);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "User registered successfully!",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while registering user!",
      });
    }
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const StepComponent = steps[currentStep];

  return (
    <div>
      <div className="flex align-items-center justify-content-center">
        <Toast ref={toast} />
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
          <div className="text-center mb-5">
            <Link href="/">
              <img
                src="/layout/logo.png"
                alt="hyper"
                height={50}
                className="mb-3"
              />
            </Link>
            <div className="text-900 text-3xl font-medium mb-3">
              Join KasambahayKo
            </div>
            <span className="text-600 font-medium line-height-3">
              Already have an account?
            </span>
            <a
              href="/auth/login"
              className="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
            >
              Sign In
            </a>
          </div>

          <form>
            <div>
              <div>
                <SelectButton
                  value={formik.values.user_type}
                  name="user_type"
                  id="userType"
                  options={options}
                  onChange={(e) => {
                    formik.setFieldValue("user_type", e.value);
                  }}
                  className={classNames(
                    "user-type-select m-auto w-8 flex justify-content-center",
                    { "p-invalid": isFormFieldInvalid("user_type") }
                  )}
                />
                {getFormErrorMessage("user_type")}
              </div>
              <Steps
                className="mx-auto w-10"
                model={items}
                aria-expanded="true"
                activeIndex={currentStep}
              />
              <Divider className="mx-auto w-10 mb-5" />

              <div className="mx-auto w-10">
                <StepComponent
                  isFormFieldInvalid={isFormFieldInvalid}
                  getFormErrorMessage={getFormErrorMessage}
                  formik={formik}
                  onSubmit={onSubmit}
                  handleNextStep={handleNextStep}
                  handlePreviousStep={handlePreviousStep}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
