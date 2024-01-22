import EmployerNavbar from "@/layout/EmployerNavbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
// const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
import styles from "@/layout/components/employer/interview/InterviewPage.module.css";

import { v4 } from "uuid";
import { Button } from "primereact/button";
import FooterLinks from "@/layout/LandingPageComponents/AppFooter";
import WorkerNavbar from "@/layout/WorkerNavbar";

const InterviewPage = ({}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const meetingUI = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });
  const { roomId } = router.query;

  useEffect(() => {
    if (!session) return;

    import("@zegocloud/zego-uikit-prebuilt").then(({ ZegoUIKitPrebuilt }) => {
      const appId = 1100122973;
      const serverSecret = "0696f24203f82442c93d1bb0b97ef7e0";

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        v4(),
        `${session.user.firstName} ${session.user.lastName}`
      );

      const ui = ZegoUIKitPrebuilt.create(kitToken);

      ui.joinRoom({
        container: meetingUI.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    });

    meetingUI.current = meetingUI.current || document.createElement("div");
  }, [session]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  return (
    <div className={`h-full bg-white text-center`}>
      {session.user.userType === "household employer" ? (
        <EmployerNavbar />
      ) : (
        <WorkerNavbar />
      )}
      <div className="p-6">
        <div
          className="flex items-center justify-between mb-4 mx-auto"
          style={{
            width: "54%",
          }}
        >
          <h1 className="m-0">Interview Room</h1>
          <Button
            label="Maximize"
            icon="pi pi-window-maximize"
            className="bg-primary-800 text-white"
            size="small"
            onClick={toggleFullScreen}
          />
        </div>
        <div
          className={`bg-white m-5 h-full m-auto rounded-md ${
            isFullScreen ? styles.fullScreen : "relative"
          } text-center`}
        >
          <div
            className={`my-2 ${
              isFullScreen ? "absolute top-0 right-0 z-50" : "hidden"
            }`}
          >
            <Button
              label={isFullScreen ? "Minimize" : "Maximize"}
              icon={`pi ${
                isFullScreen ? "pi-window-minimize" : "pi-window-maximize"
              }`}
              className="bg-primary-800 text-white"
              size="small"
              onClick={toggleFullScreen}
            ></Button>
          </div>
          <div
            ref={meetingUI}
            className={`w-full h-full  ${styles.videoContainer}`}
          />
        </div>
      </div>
      <FooterLinks />
    </div>
  );
};

export default InterviewPage;
