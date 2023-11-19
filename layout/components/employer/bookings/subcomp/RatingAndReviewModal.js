const { Dialog } = require("primereact/dialog");
const { Rating } = require("primereact/rating");
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

const RatingAndReviewModal = ({
  show,
  hasReview,
  handleClose,
  handleCreate,
  handleUpdate,
  handleRatingChange,
  handleCommentsChange,
  rating,
  comments,
}) => {
  const footerContent = (
    <div>
      <Button
        className="small"
        label="Cancel"
        // icon="pi pi-times"
        onClick={handleClose}
        severity="secondary"
        text
      />

      <Button
        className="small"
        label={hasReview ? "Update Review" : "Submit Review"}
        // icon="pi pi-check"
        onClick={hasReview ? handleUpdate : handleCreate} // create when no review yet, update when there is
      />
    </div>
  );

  const headerTemplate = (
    <div className="flex flex-column align-items-center gap-2">
      <h5 className="m-0 font-bold text-2xl">Leave a Review</h5>
      <p className="font-normal text-sm">How would you rate your experience?</p>
    </div>
  );

  return (
    <Dialog
      header={headerTemplate}
      visible={show}
      //   style={{ width: "50vw" }}
      className="w-screen lg:w-30rem"
      onHide={handleClose}
      footer={footerContent}
      pt={{
        headerIcons: {
          className: "hidden",
        },
      }}
    >
      <div className="p-fluid flex flex-column">
        <div className="p-field flex flex-column items-center w-full p-2 mb-4">
          {/* <label htmlFor="rating" className="font-bold text-sm">
            Rating*
          </label> */}
          <Rating
            value={rating}
            cancel={false}
            onChange={(e) => handleRatingChange(e.value)}
            className=""
            pt={{
              onIcon: {
                className: "text-orange-400",
                style: { width: "1.6rem", height: "1.6rem" },
              },
              offIcon: {
                className: "",
                style: { width: "1.6rem", height: "1.6rem" },
              },
            }}
          />
        </div>
        <div className="p-field">
          <span className="p-float-label">
            <InputTextarea
              id="review"
              rows={5}
              cols={30}
              className=""
              value={comments}
              onChange={(e) => handleCommentsChange(e.target.value)}
            />
            <label htmlFor="review">Review</label>
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default RatingAndReviewModal;
