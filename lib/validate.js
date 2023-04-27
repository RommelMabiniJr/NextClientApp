export default function login_validate(values) {
    const errors = {};


    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 8 || values.password.length > 20) {
        errors.password = 'Must be at greater than 8 and less than 20 characters';
    } else if(values.password.includes(" ")) {
        errors.password = 'Invalid Password';
    }
    
    
    return errors;
}



export function registerValidate(values) {
    const errors= {};

    if (!values.firstName) {
        errors.firstName = 'Required';
    } else if (values.firstName.length > 15) {
        errors.firstName = 'Must be 15 characters or less';
    }

    if (!values.secondName) {
        errors.secondName = 'Required';
    } else if (values.secondName.length > 20) {
        errors.secondName = 'Must be 20 characters or less';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 8 || values.password.length > 20) {
        errors.password = 'Must be at greater than 8 and less than 20 characters';
    } else if(values.password.includes(" ")) {
        errors.password = 'Invalid Password';
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Required";
    } else if(values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    } else if(values.confirmPassword.includes(" ")) {
        errors.confirmPassword = 'Invalid Confirm Password';
    }

    return errors;
}