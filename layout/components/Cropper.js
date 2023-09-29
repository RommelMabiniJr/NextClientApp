import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useSession } from "next-auth/react";
import getCroppedImg from "./utils/getImageUtils";
import Cropper from "react-easy-crop";
import axios from "axios";

const DisplayHeader = ({}) => {
  const { data: session, status, update } = useSession({});
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [profileImageUrl, setProfileImageUrl] = useState(
    "/layout/profile-default.png"
  );

  // Fetch profile image on page load
  useEffect(() => {
    const fetchProfileImage = async () => {
      // console.log(session.user.uuid)
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      try {
        const response = await axios.get(`${serverUrl}/profile-img`, {
          params: { uuid: session.user.uuid },
          responseType: "blob",
        });

        // console.log(response.data)
        // const blob = response.data
        // const img = URL.createObjectURL(response.data);
        // console.log(img)
        // const file = new File([blob], 'image', { type: blob.type});
        // readFile(file);

        setProfileImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
      }
    };
    fetchProfileImage();
  }, [session.user.uuid]);

  function readFile(input) {
    const fr = new FileReader();
    fr.readAsDataURL(input);
    fr.onload = () => {
      const res = fr.result;
      // console.log(res)
      return res;
    };
  }

  const handleImgClick = () => {
    setVisible(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(file);
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
    setCroppedArea(croppedArea);
  };

  // this function is used to convert the base64 cropped image to a file object
  async function getCroppedFile(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    fileName = "cropped.jpg"
  ) {
    const dataUrl = await getCroppedImg(imageSrc, pixelCrop, rotation, flip);
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }

  const handleUpload = async () => {
    // code to upload the croppedImage

    try {
      const croppedImage = await getCroppedFile(
        URL.createObjectURL(image),
        croppedAreaPixels
      );

      // console.log(croppedImage)
      // console.log(image)

      const formData = new FormData();
      formData.append("croppedImage", croppedImage);
      formData.append("uuid", session.user.uuid);

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      const response = await axios.post(
        `${serverUrl}/profile-img/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log(response.data);
      // close the dialog and reset the state
      setVisible(false);
      setImage(null);
      setPreviewUrl(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedImage(null);

      // update the profile image
      setProfileImageUrl(URL.createObjectURL(croppedImage));

      console.log(session);
      // update the session
      await update({
        ...session,
        user: {
          ...session.user,
          imageUrl: URL.createObjectURL(croppedImage),
        },
      });
      console.log(session);
    } catch (error) {
      console.error(error);
    }
  };

  const fileUploadRef = useRef(null);

  const chooseFile = () => {
    fileUploadRef.current.choose();
  };

  const handleCancel = () => {
    // setVisible(false);
    setImage(null);
    setPreviewUrl(null);
  };

  const footer = (
    <div>
      <Button
        label="Upload"
        onClick={handleUpload}
        disabled={!croppedAreaPixels}
      />
      <Button
        label="Cancel"
        onClick={() => setVisible(false)}
        className="p-button-secondary"
      />
    </div>
  );

  return (
    <>
      <div className="text-center">
        <div className="relative w-max mx-auto py-2">
          <Avatar
            image={profileImageUrl}
            alt="profile"
            shape="circle"
            className="h-8rem w-8rem md:w-10rem md:h-10rem shadow-2 cursor-pointer "
            onClick={handleImgClick}
          />
          <Badge
            value={<i className="pi pi-camera" />}
            size="large"
            className="absolute bottom-0 left-50 translate-badge cursor-pointer p-ripple"
            onClick={handleImgClick}
          ></Badge>
        </div>
        <h2 className="my-2">
          {session.user.firstName + " " + session.user.lastName}
        </h2>
        <h5 className="my-3 font-light">
          {session.user.city} | {session.user.barangay} |{" "}
          {session.user.street == ""
            ? "No Specified Street"
            : session.user.street}
        </h5>
        {/* <Button label='Edit Profile' className='p-button-outlined' /> */}
        <Dialog
          className="w-6 relative"
          header="Upload Profile Image"
          visible={visible}
          onHide={() => setVisible(false)}
          footer={footer}
        >
          <div className="flex flex-column align-items-center">
            <div className="relative preview-card p-card p-2 w-full h-23rem">
              {previewUrl && (
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  aspect={1}
                />
              )}
            </div>
            {/* <input type='file' accept='image/*' onChange={handleFileSelect} /> */}
            <div className="p-fluid flex w-full flex justify-content-center gap-3 mt-2">
              <FileUpload
                ref={fileUploadRef}
                name="croppedImage"
                mode="basic"
                chooseLabel="Choose Profile Image"
                accept="image/*"
                maxFileSize={10000000}
                customUpload={false}
                auto={true}
                className="p-mt-2 w-45rem"
                onUpload={(event) => {
                  setImage(event.files[0]);
                  setPreviewUrl(URL.createObjectURL(event.files[0]));
                }}
              />
              <Button
                label="Remove"
                disabled={!previewUrl}
                className="p-button-danger w-4"
                onClick={handleCancel}
              />
              {/* <Button icon='pi pi-camera' className='p-button-rounded p-button-secondary p-button-sm p-ml-2' onClick={chooseFile} /> */}
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default DisplayHeader;
