import { Timeline } from "primereact/timeline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import { Button } from "primereact/button";

const OfferTimeline = ({ offerEvents, session }) => {
  dayjs.extend(relativeTime);

  const [comment, setComment] = useState("");

  const CustomMarker = ({ item }) => {
    // console.log(item.profile_url);
    return (
      <div className="">
        {item.eventType === "simple" ? (
          <div style={{ width: "1.5rem" }} className="">
            <div
              style={{ width: "1rem", height: "1rem" }}
              className="flex flex-col items-center border-2 border-gray-500 bg-gray-100 rounded-full m-auto"
            ></div>
          </div>
        ) : (
          <div style={{ width: "1.5rem", height: "1.5rem" }}>
            <img
              className="rounded-full "
              style={{ width: "1.5rem", height: "1.5rem" }}
              src={item.profile_url}
              alt={item.user}
            />
          </div>
        )}
      </div>
    );
  };

  const CustomContent = ({ item }) => {
    const timestamp = dayjs(item.timestamp).fromNow();
    return (
      <li key={item.id} className="timeline-item list-none text-sm">
        {item.eventType === "simple" ? (
          <div className="timeline-content flex justify-between items-center ">
            <div className="timeline-header">
              <span className={`timeline-badge ${item.statusClass}`}></span>
              <span className="timeline-title font-semibold text-gray-900 align-top">
                {item.user + " "}
              </span>
              <span className="timeline-body text-gray-600">{item.action}</span>
            </div>

            <span className="timeline-time m-o">{timestamp}</span>
          </div>
        ) : (
          <div className="timeline-content text-sm rounded-md border-2 p-2 mb-3">
            <div className="flex justify-between items-center">
              <div className="timeline-header">
                <span className={`timeline-badge ${item.statusClass}`}></span>
                <span className="timeline-title font-semibold text-gray-900 align-top">
                  {item.user + " "}
                </span>
                <span className="timeline-body text-gray-600">
                  {item.action}
                </span>
              </div>

              <span className="timeline-time m-o">{timestamp}</span>
            </div>
            <div className="timeline-content my-2">
              <p className="text-sm text-gray-600">{item.content}</p>
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <Timeline
        opposite={false}
        marker={(item) => <CustomMarker item={item} />}
        content={(item) => <CustomContent item={item} />}
        value={offerEvents}
        className="pl-4"
        pt={{
          opposite: {
            className: "hidden",
          },
        }}
      />
      <div className="p-4 pr-3 flex gap-x-4">
        <div style={{ width: "1.5rem", height: "1.5rem" }}>
          <img
            className="rounded-full "
            style={{ width: "1.5rem", height: "1.5rem" }}
            src={session.user.imageUrl}
            alt={session.user.firstName}
          />
        </div>
        <div className="w-full flex flex-column">
          <InputTextarea
            placeholder="Add your comment..."
            value={comment}
            autoResize
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full text-sm"
          />
          <div className="self-end">
            <Button label="Comment" className="mt-3 ml-auto" size="small" />
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferTimeline;
