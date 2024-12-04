import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./OtherGroupPosts.css";

function OtherGroupPosts() {
  const { groupID } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostID, setEditPostID] = useState(null); // Track the post being edited
  const [editPostContent, setEditPostContent] = useState(""); // Content of the post being edited
  const [userID, setUserID] = useState(null);
  const [ownerID, setOwnerID] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserID(user.userid);
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/group-posts/${groupID}`);
        if (!response.ok) throw new Error("Failed to fetch posts.");
        const data = await response.json();
        setPosts(data.posts);
        setOwnerID(data.ownerID);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [groupID]);

  const handleAddPost = async () => {
    if (!newPostContent.trim()) {
      alert("Post content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/group-posts/${groupID}/add-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID,
          content: newPostContent,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setNewPostContent("");
        alert("Post added successfully.");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add post.");
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleEditPost = async () => {
    if (!editPostContent.trim()) {
      alert("Edited content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/group-posts/${groupID}/edit-post`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postID: editPostID,
          content: editPostContent,
        }),
      });

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.postid === editPostID ? { ...post, content: editPostContent } : post
          )
        );
        setEditPostID(null);
        setEditPostContent("");
        alert("Post updated successfully.");
      } else {
        alert("Failed to update post. Please try again.");
      }
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleDeletePost = async (postID) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`http://localhost:5000/group-posts/${groupID}/${postID}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.postid !== postID));
        alert("Post deleted successfully.");
      } else {
        alert("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="other-group-posts-container">
      <h1 className="other-group-posts-title">Group Posts</h1>
  
      {/* Add Post Section */}
      <div className="other-add-post-container">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write something..."
          className="other-add-post-textarea"
        />
        <button className="other-btn-add-post" onClick={handleAddPost}>
          Add Post
        </button>
      </div>
  
      {/* Posts List */}
      <div className="other-posts-list-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.postid}
              className={`other-post-card ${
                post.userid === ownerID
                  ? "other-admin-post"
                  : post.userid === userID
                  ? "other-my-post"
                  : ""
              }`}
            >
              {/* Admin Label */}
              {post.userid === ownerID && (
                <span className="other-admin-label">Admin</span>
              )}
  
              {/* Editing a Post */}
              {editPostID === post.postid ? (
                <div className="other-edit-post-container">
                  <textarea
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    placeholder="Edit your post..."
                    className="other-edit-post-textarea"
                  />
                  <div className="other-edit-post-buttons">
                    <button
                      className="other-btn-save-post"
                      onClick={handleEditPost}
                    >
                      Save
                    </button>
                    <button
                      className="other-btn-cancel-edit"
                      onClick={() => setEditPostID(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="other-post-content">
                  {/* Post Content */}
                  <p className="other-post-text">{post.content}</p>
                  <p className="other-post-meta">
                    <span className="other-post-author">
                      Posted by: {post.firstname} {post.lastname}
                    </span>
                  </p>
  
                  {/* Post Buttons */}
                  {post.userid === userID && (
                    <div className="other-post-buttons">
                      <button
                        className="other-btn-edit-post"
                        onClick={() => {
                          setEditPostID(post.postid);
                          setEditPostContent(post.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="other-btn-delete-post"
                        onClick={() => handleDeletePost(post.postid)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="other-no-posts-message">
            No posts available. Be the first to add one!
          </p>
        )}
      </div>
    </div>
  );
  

  
  
}

export default OtherGroupPosts;
