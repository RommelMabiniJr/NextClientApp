import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useRef, useState } from "react";

export default function ProfilePictureUpload({
  parentSrc,
  onCaptureImage,
  formik,
}) {
  const [displayBasic, setDisplayBasic] = useState(false);
  const [isCapturing, setIsCapturing] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const videoRef = useRef(null);

  const handleCapture = async () => {
    try {
      setIsCapturing(true);
      setImageSrc(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleOpen = async () => {
    setDisplayBasic(true);
    try {
      setIsCapturing(true);
      setImageSrc(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleClose = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stop the camera stream after capturing the photo
    }
    setDisplayBasic(false);
    setImageSrc(null);
    setIsCapturing(false);
  };

  const handleSave = () => {
    onCaptureImage(imageBlob, imageSrc); // Pass captured image source to parent component
    handleClose();
  };

  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const mediaStreamTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(mediaStreamTrack);
      const blob = await imageCapture.takePhoto();

      // Convert blob to File object with type 'image/jpeg'
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      const imageURL = URL.createObjectURL(blob);
      setImageBlob(file); // Set the File object instead of blob
      setImageSrc(imageURL);
      setIsCapturing(false);
      mediaStreamTrack.stop();
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  return (
    <div>
      <div onClick={handleOpen} className="col-12">
        {parentSrc ? (
          <div className="flex flex-column justify-content-center text-900 align-items-center h-full p-5 border-2 border-dashed rounded-lg hover:border-primary-500 hover:text-primary-600 cursor-pointer">
            <img
              src={parentSrc}
              alt="Profile Picture"
              className="rounded-full w-80 h-80"
            />
          </div>
        ) : (
          <div className="flex flex-column justify-content-center text-900 align-items-center h-full p-5 border-2 border-dashed rounded-lg hover:border-primary-500 hover:text-primary-600 cursor-pointer">
            <span>
              <i className="pi pi-upload text-2xl "></i>
            </span>
            <p className="font-bold text-xl mb-2"> Take Photo</p>
            <div className="font-medium text-center">
              {" "}
              Click this card to take a picture of yourself{" "}
            </div>
          </div>
        )}
      </div>
      {/* <button onClick={handleOpen}>Open</button> */}
      <Dialog
        header="Profile Picture"
        maximizable
        visible={displayBasic}
        style={{ width: "auto" }}
        onHide={handleClose}
      >
        <div className="flex flex-col items-center relative">
          {imageSrc && <img src={imageSrc} alt="Captured" />}
          {isCapturing && <video width={600} ref={videoRef}></video>}

          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
          />
          <div className="absolute inset-x-0 bottom-0 w-full flex justify-center gap-5 my-3">
            {!isCapturing && (
              <Button
                severity="secondary"
                className="font-bold"
                onClick={handleCapture}
              >
                <i className="pi pi-undo mr-2"></i> Retake Photo
              </Button>
            )}
            {!isCapturing && (
              <Button
                severity="success"
                className="font-bold"
                onClick={handleSave}
              >
                <i className="pi pi-save mr-2"></i> Save
              </Button>
            )}
            {isCapturing && (
              <Button className="font-bold" onClick={capturePhoto}>
                <i className="pi pi-camera mr-2"></i> Capture
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
