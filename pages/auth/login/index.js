import Navbar from "../../../layout/components/Navbar";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import login_validate from "@/lib/validators/validate";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";

const LoginPage = () => {
  const { status } = useSession();
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const toast = useRef(null);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: login_validate,
    onSubmit,
  });

  async function onSubmit(values) {
    // e.preventDefault();

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      remember: checked,
      redirect: false,
      callbackUrl: "/app/user-router",
    });

    if (result.ok) router.push("/app/user-router");
    else {
      toast.current.show({
        severity: "error",
        summary: "Login Failed",
        detail: "Invalid email or password",
        life: 3000,
      });
    }
  }

  async function mockuplogin() {
    const result = await signIn("credentials", {
      email: "eseiseno@gmail.com",
      password: "12345678",
      remember: checked,
      redirect: false,
      callbackUrl: "/app/user-router",
    });

    return result;
  }

  // This is a mockup login for testing: comment or uncomment this to use this feature

  // useEffect( () => {

  //     async function doLoginMockup() {
  //         const result = await mockuplogin();

  //         if (result.ok) router.push(result.url)
  //     }

  //     doLoginMockup();
  // }, [])

  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "/app/user-router" });
  }

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  if (status === "authenticated") {
    router.push("/app/user-router");
  }

  return (
    <div>
      <Toast ref={toast} />
      <Navbar
        link1="About Us"
        link1To="/about"
        link2="Contact Us"
        link2To="/contact"
        link3="Subscribe"
        link3To="/subscribe"
      />
      <div className="flex align-items-center justify-content-center">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
          <div className="text-center mb-5 flex flex-column items-center">
            <Link href="/">
              <img
                src="/layout/logo.png"
                alt="hyper"
                height={100}
                width={100}
                className="mb-3"
              />
            </Link>
            <div className="text-900 text-3xl font-medium mb-3">
              Welcome Back
            </div>
            <span className="text-600 font-medium line-height-3">
              Don&apos;t have an account?
            </span>
            <Link
              href="/register"
              className="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
            >
              Create today!
            </Link>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-900 font-medium mb-2"
              >
                Email
              </label>
              <InputText
                {...formik.getFieldProps("email")}
                id="email"
                type="text"
                placeholder="Email address"
                className={classNames("w-full", {
                  "p-invalid": isFormFieldInvalid("email"),
                })}
              />
              {getFormErrorMessage("email")}

              <label
                htmlFor="password"
                className="block text-900 font-medium mb-2 mt-3"
              >
                Password
              </label>
              <InputText
                {...formik.getFieldProps("password")}
                id="password"
                type="password"
                placeholder="Password"
                className={classNames("w-full", {
                  "p-invalid": isFormFieldInvalid("password"),
                })}
              />
              {getFormErrorMessage("password")}

              <div className="flex align-items-center justify-content-between mb-6 mt-3">
                <div className="flex align-items-center">
                  <Checkbox
                    id="rememberme"
                    onChange={(e) => setChecked(e.checked)}
                    checked={checked}
                    className="mr-2"
                  />
                  <label htmlFor="rememberme">Remember me</label>
                </div>
                <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                  Forgot your password?
                </a>
              </div>

              <Button
                loading={formik.isSubmitting}
                type="Submit"
                label="Log In"
                icon="pi pi-user"
                className="w-full mb-4"
              />
            </div>
          </form>
          <Button
            onClick={handleGoogleSignin}
            label="Sign in with Google"
            icon="pi pi-google"
            className="w-full border-gray-500 text-600"
            outlined
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
