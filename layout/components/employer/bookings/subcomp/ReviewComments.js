import { useEffect, useRef, useState } from "react";

const ReviewComments = ({ comments }) => {
  const [showComments, setShowComments] = useState(false);
  const [showSeeMoreAndLess, setShowSeeMoreAndLess] = useState(false); // [1
  const commentContentRef = useRef(null);

  useEffect(() => {
    const commentContent = commentContentRef.current;
    const computedStyle = window.getComputedStyle(commentContent);

    const parentHeight = parseInt(computedStyle.height);

    const isOverflowing = commentContent.scrollHeight > parentHeight;

    setShowSeeMoreAndLess(isOverflowing);
  }, [comments]);

  // console.log("comments", comments);

  return (
    <div className="text-sm">
      <div
        className={`${showComments ? "line-clamp-none" : "line-clamp-3"}`}
        ref={commentContentRef}
      >
        <p className="m-0 text-justify">
          {comments ? comments : "No review yet."}
        </p>
      </div>
      {showSeeMoreAndLess && (
        <span
          className="mb-2 text-blue-500 hover:text-blue-700 underline cursor-pointer hover:no-underline"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "See Less" : "See More"}
        </span>
      )}
    </div>
  );
};

export default ReviewComments;
