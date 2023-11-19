import AppliedContainer from "../../applicants/containers/applied/AppliedContainer";

const ApplicantsSection = ({ postId, applicants, distances }) => {
  console.log("ApplicantsSection: ", postId, applicants, distances);

  return (
    <AppliedContainer
      postId={postId}
      applicants={applicants}
      distances={distances}
      //   setActiveIndex={setActiveIndex}
    />
  );
};

export default ApplicantsSection;
