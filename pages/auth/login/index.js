import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { signIn, signOut } from 'next-auth/react';
import { useFormik } from "formik";
import { classNames } from 'primereact/utils';
import login_validate from "@/lib/validate";

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate: login_validate,
        onSubmit
    })

    async function onSubmit(values) {
        console.log(values);
    }

    async function handleGoogleSignin() {
        signIn('google', "http://localhost:3000");
    }

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (

        <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src="/layout/logo.png" alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                    <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                        <InputText {...formik.getFieldProps('email')} id="email" type="text" placeholder="Email address" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('email') })} />
                        {getFormErrorMessage('email')}

                        <label htmlFor="password" className="block text-900 font-medium mb-2 mt-3">Password</label>
                        <InputText {...formik.getFieldProps('password')} id="password" type="password" placeholder="Password" className={classNames("w-full", { 'p-invalid': isFormFieldInvalid('password') })} />
                        {getFormErrorMessage('password')}

                        <div className="flex align-items-center justify-content-between mb-6 mt-3">
                            <div className="flex align-items-center">
                                <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                                <label htmlFor="rememberme">Remember me</label>
                            </div>
                            <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
                        </div>

                        <Button type="Submit" label="Log In" icon="pi pi-user" className="w-full mb-4" />
                        <Button onClick={handleGoogleSignin} label="Sign in with Google" icon="pi pi-google" className="w-full border-gray-500 text-600" outlined />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;