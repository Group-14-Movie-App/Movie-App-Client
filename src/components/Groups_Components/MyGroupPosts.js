import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MyGroupPosts.css";

function MyGroupPosts() {
  const { groupID } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostID, setEditPostID] = useState(null); // Track the post being edited
  const [editPostContent, setEditPostContent] = useState(""); // Content of the post being edited
  const [ownerID, setOwnerID] = useState(null); // To track the group's admin (owner)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const response = await fetch(`http://localhost:5000/my-group-posts/${groupID}`);
        if (!response.ok) throw new Error("Failed to fetch posts.");
        const data = await response.json();

        setPosts(data.posts);
        setOwnerID(data.ownerID); // Set the group owner's ID
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
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You need to be logged in to add a post.");
        return;
      }

      const response = await fetch(`http://localhost:5000/my-group-posts/${groupID}/add-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.userid,
          content: newPostContent,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setNewPostContent("");
        alert("Post added successfully.");
      } else {
        alert("Failed to add post. Please try again.");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleEditPost = async () => {
    if (!editPostContent.trim()) {
      alert("Edited content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/my-group-posts/${groupID}/edit-post`, {
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
      const response = await fetch(`http://localhost:5000/my-group-posts/${groupID}/delete-post`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postID }),
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
    <div className="my-group-posts-container">
      <h1 className="my-group-posts-title">My Group Posts</h1>
  
      {/* Add Post Section */}
      <div className="add-post-container">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write something..."
          className="add-post-textarea"
        />
        <button className="btn-add-post" onClick={handleAddPost}>
          Add Post
        </button>
      </div>
  
      {/* Posts List */}
      <div className="posts-list-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.postid}
              className={`post-card ${post.userid === ownerID ? "admin-post" : ""}`}
            >
              {post.userid === ownerID && (
                <span className="admin-label">Admin</span>
              )}
              {/* Editing a Post */}
              {editPostID === post.postid && post.userid === ownerID ? (
                <div className="edit-post-container">
                  <textarea
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    placeholder="Edit your post..."
                    className="edit-post-textarea"
                  />
                  <div className="edit-post-buttons">
                    <button className="btn-save-post" onClick={handleEditPost}>
                      Save
                    </button>
                    <button
                      className="btn-cancel-edit"
                      onClick={() => setEditPostID(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="post-content">
                  {/* Post Content */}
                  <p className="post-text">{post.content}</p>
                  <p className="post-meta">
                    <span className="post-author">
                      Posted by: {post.firstname} {post.lastname}
                    </span>
                  </p>
                  {/* Post Buttons */}
                  <div className="post-buttons">
                    {post.userid === ownerID && (
                      <button
                        className="btn-edit-post"
                        onClick={() => {
                          setEditPostID(post.postid);
                          setEditPostContent(post.content);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="btn-delete-post"
                      onClick={() => handleDeletePost(post.postid)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-posts-message">No posts available. Be the first to add one!</p>
        )}
      </div>
    </div>
  );

  
  
}

export default MyGroupPosts;
