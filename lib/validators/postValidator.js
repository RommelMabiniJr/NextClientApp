export function postJobTitleAndDescriptionValidate(
  values,
  maxTitleLength,
  maxDescriptionLength
) {
  const errors = {};

  if (!values.jobTitle) {
    errors.jobTitle = "Required";
  } else if (values.jobTitle.length > maxTitleLength) {
    errors.jobTitle = `Must be ${maxTitleLength} characters or less`;
  }

  if (!values.jobDescription) {
    errors.jobDescription = "Required";
  } else if (values.jobDescription.length > maxDescriptionLength) {
    errors.jobDescription = `Must be ${maxDescriptionLength} characters or less`;
  }

  if (!values.jobStartDate) {
    errors.jobStartDate = "Required";
  }

  if (!values.jobEndDate) {
    errors.jobEndDate = "Required";
  }

  if (!values.jobStartTime) {
    errors.jobStartTime = "Required";
  }

  if (!values.jobEndTime) {
    errors.jobEndTime = "Required";
  }

  if (!values.jobStartDate && !values.jobEndDate) {
    errors.jobStartDate = "Required";
    errors.jobEndDate = "Required";
  }

  // validator to make sure that the end date is not before the start date
  if (values.jobStartDate && values.jobEndDate) {
    const startDate = new Date(values.jobStartDate);
    const endDate = new Date(values.jobEndDate);

    if (endDate < startDate) {
      errors.jobEndDate = "End date cannot be before start date";
    }
  }

  if (!values.livingArrangement) {
    errors.livingArrangement = "Required";
  }

  return errors;
}
