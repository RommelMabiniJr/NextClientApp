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
import { useEffect, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";

const Posts = ({ posts }) => {
  const [filteredPosts, setFilteredPosts] = useState([]); // posts is an array of objects, each object is a job post
  const [postStatus, setPostStatus] = useState("active");
  const [sortOption, setSortOption] = useState("Recent");
  const sortingOptions = ["Recent", "Oldest"];

  const handleSortOptionChange = (e) => {
    setSortOption(e.value);

    const sortedPosts = [...filteredPosts];

    if (e.value == "Recent") {
      sortedPosts.sort((a, b) => {
        return new Date(b.job_posting_date) - new Date(a.job_posting_date);
      });
    }

    if (e.value == "Oldest") {
      sortedPosts.sort((a, b) => {
        return new Date(a.job_posting_date) - new Date(b.job_posting_date);
      });
    }

    setFilteredPosts([...sortedPosts]);
  };

  const statusItems = [
    { label: "All Posts", value: "all" },
    { label: "Active", value: "active" },
    { label: "Closed", value: "closed" },
  ];

  const handlePostStatusChange = (e) => {
    setPostStatus(e.value);

    let finalPosts;

    if (e.value === "all") {
      finalPosts = [{ isNew: true }, ...posts];
      setFilteredPosts(finalPosts);
    } else {
      // filter based on post.job-start_date
      // Active if post.job-start_date is in the future
      // Closed if post.job-start_date is in the past

      const filtered = posts.filter((post) => {
        if (e.value === "active") {
          return new Date(post.job_start_date) > new Date();
        } else {
          return new Date(post.job_start_date) < new Date();
        }
      });

      finalPosts = [{ isNew: true }, ...filtered];

      setFilteredPosts(finalPosts);
    }
  };

  useEffect(() => {
    const activePosts = posts.filter((post) => {
      return new Date(post.job_start_date) > new Date();
    });

    // DEFAULT SORTING
    // sort by most recent
    activePosts.sort((a, b) => {
      return new Date(b.job_posting_date) - new Date(a.job_posting_date);
    });

    setFilteredPosts([{ isNew: true }, ...activePosts]);
  }, [posts]);

  useEffect(() => {
    // activate sorting when postStatus changes
    if (filteredPosts.length > 0) {
      handleSortOptionChange({ value: sortOption });
    }
  }, [postStatus]);

  const postTemplate = (post) => {
    // convert date string passed from server to date object
    const dateConverter = DateConverter();
    const postDate = dateConverter.convertDateToReadable(post.job_posting_date);
    const Router = useRouter();

    if (post.isNew) {
      return (
        <div className="col-12 md:col-6 lg:col-4 p-3">
          <Link href="/app/posts/create/">
            {/* When hovered, highlight using primary color */}
            <div className="flex flex-column justify-content-center text-900 align-items-center h-full p-5 border-2 border-dashed rounded-lg hover:border-primary-500 hover:text-primary-600 cursor-pointer">
              <span>
                <i className="pi pi-upload text-2xl "></i>
              </span>
              <p className="font-bold text-xl mb-2"> Create Post</p>
              <div className="font-medium text-center">
                {" "}
                Click this card to create a new job post.
              </div>
            </div>
          </Link>
        </div>
      );
    }

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
              <ShowPostButton post={post} />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="col-12">
      <div className="">
        <div className="">
          <div className="flex justify-between items-center">
            <h1 className="text-left mt-3 mb-5 font-semibold">Jobposts</h1>

            <div className="flex gap-6">
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
              <SelectButton
                value={postStatus}
                options={statusItems}
                onChange={(e) => handlePostStatusChange(e)}
                optionLabel="label"
              />
            </div>
          </div>
          <DataView
            value={filteredPosts}
            className="grid"
            itemTemplate={postTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default Posts;
