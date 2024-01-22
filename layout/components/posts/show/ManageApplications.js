import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";
import { useRouter } from "next/router";
import Router from "next/router";
import Link from "next/link";
import DateConverter from "@/lib/dateConverter";
import ShowPostButton from "./subcomp/ShowPostButton";
import styles from "@/styles/Posts.module.css";
import { useEffect, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { JobPostService } from "@/layout/service/JobPostService";
import { AvatarGroup } from "primereact/avatargroup";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";

const ManageApplications = ({ posts }) => {
  const [filteredPosts, setFilteredPosts] = useState([]); // posts is an array of objects, each object is a job post
  const [sortOption, setSortOption] = useState("Recent");
  const sortingOptions = ["Recent", "Oldest"];

  const handleSortOptionChange = (e) => {
    setSortOption(e.value);

    if (e.value == "Recent") {
      filteredPosts.sort((a, b) => {
        return new Date(b.job_posting_date) - new Date(a.job_posting_date);
      });
    }

    if (e.value == "Oldest") {
      filteredPosts.sort((a, b) => {
        return new Date(a.job_posting_date) - new Date(b.job_posting_date);
      });
    }

    setFilteredPosts(filteredPosts);
  };

  useEffect(() => {
    const fetchData = async () => {
      // show only the posts that are active (job_start_date is in the future)
      const activePosts = posts.filter((post) => {
        return new Date(post.job_start_date) > new Date();
      });

      const fetchApplicants = async (post) => {
        const fetchedApplicants = await JobPostService.getApplicants(
          post.job_id
        );
        return fetchedApplicants;
      };

      // for every active post, fetch the applicants and add it to the post object
      for (const post of activePosts) {
        const applicants = await fetchApplicants(post);
        post.applicants = applicants;
      }

      // DEFAULT SORTING
      // sort by most recent
      activePosts.sort((a, b) => {
        return new Date(b.job_posting_date) - new Date(a.job_posting_date);
      });

      setFilteredPosts([...activePosts]);
    };

    fetchData();
  }, [posts]);

  const footerContent = (post) => (
    <div className="flex justify-between">
      {/* Component for delete confirm */}
      <div className="flex items-center">
        <label className="mr-2 text-large font-bold">APPLICANTS:</label>
        <AvatarGroup>
          {/* If more than 4, show 4 and +{applicants.length - 4} */}
          {post.applicants.slice(0, 4).map((applicant) => (
            <Avatar
              key={applicant.application_id}
              image={applicant.information.profile_url}
              size="normal"
              shape="circle"
              className="p-mr-2"
              tooltip={applicant.information.first_name}
              tooltipOptions={{ position: "top" }}
            />
          ))}
          {post.applicants.length > 4 && (
            <Avatar
              label={`+${applicants.length - 4}`}
              size="normal"
              shape="circle"
              className="p-mr-2"
            />
          )}
        </AvatarGroup>
      </div>
      <div className="">
        <Button
          label="MANAGE APPLICATIONS"
          // icon="pi pi-angle-double-right"
          iconPos="right"
          className="p-button-secondary p-button-outlined flex-1 "
          onClick={() =>
            Router.push({
              pathname: `/app/posts/applicants/${post.job_id}`,
            })
          }
        />
      </div>
    </div>
  );

  const postTemplate = (post) => {
    // convert date string passed from server to date object
    const dateConverter = DateConverter();
    const postDate = dateConverter.convertDateToReadable(post.job_posting_date);
    const Router = useRouter();

    return (
      <div className="col-12 md:col-6 lg:col-6 p-3 border-0">
        <Card
          className="h-21rem"
          pt={{
            content: {
              className: "py-2",
            },

            root: {
              className: "shadow-none border-2",
            },
          }}
        >
          <div className="flex flex-col h-full">
            <div className="header ">
              <h5
                className={`text-800 font-semibold mb-2 ${styles.titleClamp}`} // clamp title to 2 lines
              >
                {post.job_title}
              </h5>
              <p className="text-500">{postDate}</p>
            </div>
            <div className="my-3 flex-1">
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
            <div className="flex flex-column justify-content-center">
              {footerContent(post)}
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
            <h1 className="text-left mt-3 mb-5 font-semibold">
              Manage Applications
            </h1>

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
            value={filteredPosts}
            className="grid"
            itemTemplate={postTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
