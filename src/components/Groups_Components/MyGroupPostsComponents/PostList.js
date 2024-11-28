import React from "react";
import PostCard from "./PostCard";

function PostList({
  posts,
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
    <div className="posts-list">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.postid}
            post={post}
            ownerID={ownerID}
            setEditPostID={setEditPostID}
            setEditPostContent={setEditPostContent}
            handleDeletePost={handleDeletePost}
            editPostID={editPostID}
            editPostContent={editPostContent}
            handleEditPost={handleEditPost}
            cancelEdit={cancelEdit}
          />
        ))
      ) : (
        <p>No posts available. Be the first to add one!</p>
      )}
    </div>
  );
}

export default PostList;
