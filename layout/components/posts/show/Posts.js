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

const Posts = ({ posts }) => {
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
      <div className="col-12 md:col-6 lg:col-4 p-3">
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

  // add a new job post object to the beginning of the posts array
  const updatedPosts = [{ isNew: true }, ...posts];

  return (
    <div>
      <h1>My Posts</h1>
      <DataView
        value={updatedPosts}
        className="grid"
        itemTemplate={postTemplate}
      />
    </div>
  );
};

export default Posts;
