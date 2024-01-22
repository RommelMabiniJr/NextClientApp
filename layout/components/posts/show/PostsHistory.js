import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";
import { useRouter } from "next/router";
import Link from "next/link";
import DateConverter from "@/lib/dateConverter";
import ShowPostButton from "./subcomp/ShowPostButton";
import styles from "@/styles/Posts.module.css";
import { use, useEffect, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";

const PostHistory = ({ postHistory, setPostHistory }) => {
  const [sortOption, setSortOption] = useState("Recent");
  const sortingOptions = ["Recent", "Oldest"];

  const postTemplate = (post) => {
    // convert date string passed from server to date object
    const dateConverter = DateConverter();
    const postDate = dateConverter.convertDateToReadable(post.job_posting_date);
    const Router = useRouter();

    return (
      <div className="col-12 md:col-6 lg:col-4 p-3 border-0">
        <Card
          className="h-full"
          pt={{
            content: {
              className: "py-2",
            },

            root: {
              className: "shadow-none border-2",
            },
          }}
        >
          <div className="h-auto">
            <div className="header ">
              <h5
                className={`text-800 font-semibold mb-2 ${styles.titleClamp}`} // clamp title to 2 lines
              >
                {post.job_title}
              </h5>
              <p className="text-500">{postDate}</p>
            </div>
            <div className="my-3">
              <div className="p-mt-3 flex justify-content-between">
                <div className="">
                  <span className="text-sm font-medium mr-1">Type: </span>
                  <Tag
                    value={
                      post.job_type.charAt(0).toUpperCase() +
                      post.job_type.slice(1)
                    }
                    severity="info"
                    className="p-mr-2"
                  />
                </div>
                <p className="text-300"> | </p>
                <div>
                  <span className="text-sm font-medium mr-1">Service: </span>
                  <Tag value={post.service_name} severity="warning" />
                </div>
              </div>
              <p className={`mt-auto text-normal ${styles.descriptionClamp}`}>
                {post.job_description}...
              </p>
            </div>
            <div className="flex flex-column justify-content-center ">
              <ShowPostButton post={post} isModifiable={false} />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const handleSortOptionChange = (e) => {
    setSortOption(e.value);

    if (e.value == "Recent") {
      postHistory.sort((a, b) => {
        return new Date(b.job_posting_date) - new Date(a.job_posting_date);
      });
    }

    if (e.value == "Oldest") {
      postHistory.sort((a, b) => {
        return new Date(a.job_posting_date) - new Date(b.job_posting_date);
      });
    }

    setPostHistory(postHistory);
  };

  useEffect(() => {
    // DEFAULT SORTING: Recent
    postHistory.sort((a, b) => {
      return new Date(b.job_posting_date) - new Date(a.job_posting_date);
    });

    setPostHistory(postHistory);
  }, []);

  return (
    <div className="col-12">
      <div className="">
        <div className="">
          <div className="flex justify-between items-center">
            <h1 className="text-left mt-3 mb-5 font-semibold">Post History</h1>
            <div className="flex gap-2 items-center justify-center">
              <h4 className="m-0 mr-4 ">Sort By: </h4>
              <Dropdown
                id="Sortby"
                options={sortingOptions}
                value={sortOption}
                onChange={(e) => handleSortOptionChange(e)}
                //   placeholder="Select an Arrangement"
              />
            </div>
          </div>
          <DataView
            value={postHistory}
            className="grid"
            itemTemplate={postTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default PostHistory;
