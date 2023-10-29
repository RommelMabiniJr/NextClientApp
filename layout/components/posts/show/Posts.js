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
            <Card
              title="Create a new job post"
              subTitle="Click this card to create a new job post."
              className="h-full p-shadow-hover p-clickable transition-colors transition-duration-300 hover:surface-200"
            >
              <div className="flex justify-content-center align-content-center">
                {/* <Image src='/layout/create-job.png' alt='Create a new job post' width='250'/> */}
                <Button
                  label="Create Job Post"
                  icon="pi pi-plus"
                  className="p-button-raised h-6rem mt-5"
                />
              </div>
            </Card>
          </Link>
        </div>
      );
    }

    return (
      <div className="col-12 md:col-6 lg:col-4 p-3">
        <Card className="h-full">
          <div className="h-auto">
            <div className="">
              <h5
                className={`text-800 font-semibold my-2 ${styles.titleClamp}`} // clamp title to 2 lines
              >
                {post.job_title}
              </h5>
              <p className="text-500 mb-3">{postDate}</p>
            </div>
            <div className="p-mt-3 flex justify-content-between">
              <div className="">
                <span className="text-sm font-medium mr-1">Type: </span>
                <Tag value={post.job_type} severity="info" className="p-mr-2" />
              </div>
              <p className="text-300"> | </p>
              <div>
                <span className="text-sm font-medium mr-1">Service: </span>
                <Tag value={post.service_name} severity="warning" />
              </div>
            </div>
            <p className={`mt-auto ${styles.descriptionClamp}`}>
              {post.job_description}...
            </p>

            <div className="flex justify-content-center">
              <Button
                // label="View Applicants"
                icon="pi pi-users"
                className="p-button-secondary p-button-outlined mr-2 flex-1"
                // badge="2"
                // badgeClassName="p-badge-danger"
                onClick={() =>
                  Router.push({
                    pathname: `/app/posts/applicants/${post.job_id}`,
                  })
                }
              />
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
