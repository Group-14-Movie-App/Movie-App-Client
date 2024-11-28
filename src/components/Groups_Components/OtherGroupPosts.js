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
    <div className="group-posts">
      <h1>Group Posts</h1>

      <div className="add-post">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write something..."
        />
        <button className="btn btn-primary" onClick={handleAddPost}>
          Add Post
        </button>
      </div>

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.postid}
              className={`post-card ${
                post.userid === ownerID
                  ? "admin-post"
                  : post.userid === userID
                  ? "my-post"
                  : ""
              }`}
            >
              {editPostID === post.postid ? (
                <>
                  <textarea
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    placeholder="Edit your post..."
                  />
                  <button className="btn btn-success" onClick={handleEditPost}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditPostID(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{post.content}</p>
                  <p className="post-meta">
                    Posted by: {post.firstname} {post.lastname}
                  </p>
                  {post.userid === userID && (
                    <>
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          setEditPostID(post.postid);
                          setEditPostContent(post.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeletePost(post.postid)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>No posts available. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
}

export default OtherGroupPosts;