import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useRef } from "react";
import { Toast } from "primereact/toast";

const DeletePopup = ({ post, displayDelConfirm, setDisplayDelConfirm }) => {
  const toast = useRef(null);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${serverUrl}/employer/post/delete/${post.job_id}`
      );
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Post Deleted",
        life: 3000,
      });
      setDisplayDelConfirm(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  };

  return (
    <Dialog
      header="Delete Confirmation"
      visible={displayDelConfirm}
      modal={true}
      onHide={() => {
        setDisplayDelConfirm(false);
      }}
    >
      <Toast ref={toast} />
      <div className="p-m-4">
        <p>Do you want to delete this post?</p>
        <div className="p-d-flex p-jc-end">
          <Button
            label="Cancel"
            className="p-button-text"
            onClick={() => setDisplayDelConfirm(false)}
          />
          <Button
            label="Confirm"
            className="p-button-danger p-button-outlined p-ml-2"
            onClick={handleDelete}
            autoFocus
          />
        </div>
      </div>
    </Dialog>
  );
};

export default DeletePopup;
