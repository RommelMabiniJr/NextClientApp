import EmployerNavbar from "@/layout/EmployerNavbar";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Posts from "@/layout/components/posts/show/Posts";
import PostHistory from "@/layout/components/posts/show/PostsHistory";
import ManageApplications from "@/layout/components/posts/show/ManageApplications";

export default function EditJobPostPage() {
  const { data: session, status, loading } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
  };

  if (!session) {
    return (
      <div className="h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <DisplayPosts session={session} handleSignOut={handleSignOut} />
    </div>
  );
}

const EmptyJobPosts = () => {
  return (
    <div className="flex flex-col align-items-center justify-content-center mx-auto p-5">
      <div className="text-center">
        <h1 className="text-2xl">You have no active job posts.</h1>
        <p className="text-lg">
          Click the button below to create a new job post.
        </p>
      </div>
    </div>
  );
};

const EmptyJobHistory = () => {
  return (
    <div className="flex flex-col align-items-center justify-content-center mx-auto p-5">
      <div className="text-center">
        <h1 className="text-2xl">You have no job history.</h1>
        <p className="text-lg">
          Click the button below to create a new job post.
        </p>
      </div>
    </div>
  );
};

const RenderCreateJobPostButton = () => {
  return (
    <div className="mx-auto">
      <Link href="/app/posts/create">
        <Button className="btn btn-primary">Create Job Post</Button>
      </Link>
    </div>
  );
};

const DisplayPosts = ({ session, handleSignOut }) => {
  const [posts, setPosts] = useState([]);
  const [postHistory, setPostHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // get available user posts
  useEffect(() => {
    const fetchPosts = async () => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      try {
        const response = await axios.get(
          `${serverUrl}/employer/post/get-posts?uuid=${session.user.uuid}`
        );
        setPosts(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPostsHistory = async () => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      try {
        const response = await axios.get(
          `${serverUrl}/employer/posts/get-history?uuid=${session.user.uuid}`
        );

        setPostHistory(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    setIsLoading(true);
    fetchPosts();
    fetchPostsHistory();
    setIsLoading(false);
  }, []);

  return (
    <div className="h-full">
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <TabView className="text-center">
              <TabPanel header="Jobpostings">
                {posts.length > 0 ? (
                  <Posts posts={posts} setPosts={setPosts} />
                ) : (
                  <div className="h-24rem p-6">
                    <EmptyJobPosts />
                    <RenderCreateJobPostButton />
                  </div>
                )}
              </TabPanel>
              <TabPanel header="Applications">
                {posts.length > 0 ? (
                  <ManageApplications posts={posts} setPosts={setPosts} />
                ) : (
                  <div className="h-24rem p-6">
                    <EmptyJobPosts />
                    <RenderCreateJobPostButton />
                  </div>
                )}
              </TabPanel>
              <TabPanel header="History">
                {postHistory.length > 0 ? (
                  <PostHistory
                    postHistory={postHistory}
                    setPostHistory={setPostHistory}
                  />
                ) : (
                  <div className="h-24rem p-6">
                    <EmptyJobHistory />
                    <RenderCreateJobPostButton />
                  </div>
                )}
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </div>
  );
};
