import React from "react";
import EditPostForm from "./EditPostForm"; // Import EditPostForm

function PostCard({
  post,
  ownerID,
  setEditPostID,
  setEditPostContent,
  handleDeletePost,
  editPostID,
  editPostContent,
  handleEditPost,
  cancelEdit,
}) {
  return (
    <div className={`post-card ${post.userid === ownerID ? "admin-post" : ""}`}>
      {editPostID === post.postid && post.userid === ownerID ? (
        <EditPostForm
          editPostContent={editPostContent}
          setEditPostContent={setEditPostContent}
          handleEditPost={handleEditPost}
          cancelEdit={cancelEdit}
        />
      ) : (
        <>
          <p>{post.content}</p>
          <p className="post-meta">
            Posted by: {post.firstname} {post.lastname}
          </p>
          {post.userid === ownerID && (
            <button
              className="btn btn-warning"
              onClick={() => {
                setEditPostID(post.postid);
                setEditPostContent(post.content);
              }}
            >
              Edit
            </button>
          )}
          <button className="btn btn-danger" onClick={() => handleDeletePost(post.postid)}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export default PostCard;
