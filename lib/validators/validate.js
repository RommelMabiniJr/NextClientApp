export default function login_validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8 || values.password.length > 20) {
    errors.password = "Must be at greater than 8 and less than 20 characters";
  } else if (values.password.includes(" ")) {
    errors.password = "Invalid Password";
  }

  return errors;
}

export function registerValidate(values) {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = "Required";
  } else if (values.firstName.length > 15) {
    errors.firstName = "Must be 15 characters or less";
  }

  if (!values.secondName) {
    errors.secondName = "Required";
  } else if (values.secondName.length > 20) {
    errors.secondName = "Must be 20 characters or less";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.isEmailVerified) {
    errors.isEmailVerified = "Email is not verified";
  }

  if (!values.phone) {
    errors.phone = "Required";
  } else if (values.phone.length < 11 || values.phone.length > 11) {
    errors.phone = "Must be 11 characters";
  } else if (values.phone.includes(" ")) {
    errors.phone = "Invalid Phone Number";
  }

  if (!values.city) {
    errors.city = "Required";
  }

  if (!values.barangay) {
    errors.barangay = "Required";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8 || values.password.length > 20) {
    errors.password = "Must be at greater than 8 and less than 20 characters";
  } else if (values.password.includes(" ")) {
    errors.password = "Invalid Password";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  } else if (values.confirmPassword.includes(" ")) {
    errors.confirmPassword = "Invalid Confirm Password";
  }

  if (!values.user_type) {
    errors.user_type = "Select a user type";
  }

  return errors;
}

export function completeProfileValidate(values) {
  // For reference:

  // const formik = useFormik({
  //   initialValues: {
  //     householdSize: "",
  //     pets: {
  //       dog: false,
  //       cat: false,
  //       otherPets: false,
  //     },
  //     specificNeeds: "",
  //     paymentMethods: [],
  //     paymentFrequency: "",
  //     bio: "",
  //   },

  const errors = {};

  if (!values.householdSize) {
    errors.householdSize = "Household size is required";
  }

  if (!values.paymentFrequency) {
    errors.paymentFrequency = "Payment frequency is required";
  }

  if (!values.profilePhoto) {
    errors.profilePhoto = "Profile photo is required";
  }

  return errors;
}

export function workerCompleteProfileValidate(values) {
  const errors = {};

  if (!values.servicesOffered.length) {
    errors.servicesOffered = "Services offered is required";
  }

  if (!values.hourlyRate) {
    errors.hourlyRate = "Hourly rate is required";
  }

  if (!values.skills) {
    errors.skills = "Skills is required";
  }

  if (!values.languages) {
    errors.languages = "Languages is required";
  }

  if (!values.education) {
    errors.education = "Education is required";
  }

  if (!values.profilePhoto) {
    errors.profilePhoto = "Profile photo is required";
  }

  // Check that there is at least one document uploaded
  // if (
  //   !values.documents.resume &&
  //   !values.documents.nbiClearance &&
  //   !values.documents.barangayClearance &&
  //   !values.documents.policeClearance
  // ) {
  //   errors.documents = "At least one document is required";
  // }

  return errors;
}
