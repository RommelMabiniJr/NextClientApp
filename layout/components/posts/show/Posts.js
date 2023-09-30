import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";
import Link from "next/link";
import DateConverter from "@/lib/dateConverter";
import ShowPostButton from "./subcomp/ShowPostButton";

const Posts = ({ posts }) => {
  const postTemplate = (post) => {
    // convert date string passed from server to date object
    const dateConverter = DateConverter();
    const postDate = dateConverter.convertDateToReadable(post.job_posting_date);

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
        <Card className="h-full" title={post.job_title} subTitle={postDate}>
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
          <p>{post.job_description}</p>
          {/* <Button label='View Details' className='p-mt-3' /> */}
          <ShowPostButton post={post} />
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
