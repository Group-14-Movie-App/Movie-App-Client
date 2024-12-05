import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown"; // For rendering markdown content
import "./OtherGroupPosts.css";
import MyGroupPostsModal from "./MyGroupPostsModal/GroupPostsModal.js"; // Reuse the existing modal component

function OtherGroupPosts() {
  const { groupID } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostID, setEditPostID] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [userID, setUserID] = useState(null);
  const [ownerID, setOwnerID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Group Name Location Related
  const location = useLocation();
  const group = location.state?.group || {};

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

  const handleAddPost = async (content) => {
    if (!content.trim()) {
      alert("Post content cannot be empty.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You need to be logged in to add a post.");
        return;
      }

      const response = await fetch(`http://localhost:5000/group-posts/${groupID}/add-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID,
          content,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();

        // Attach the author's details to the new post
        newPost.firstname = user.firstname;
        newPost.lastname = user.lastname;

        // Add the new post to the state
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
        const updatedPost = await response.json();
        setPosts(
          posts.map((post) =>
            post.postid === editPostID ? { ...post, content: updatedPost.content } : post
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

  const handleMovieCardClick = (movie) => {
    const message = `
**🎥 Movie Invitation!**  
**Title:** ${movie.title}  
**Start Time:** ${new Date(movie.startTime).toLocaleString()}  
**End Time:** ${new Date(movie.endTime).toLocaleString()}  
**Theater:** ${movie.theatreAndAuditorium}  

![Movie Poster](${movie.image})
`;

    if (message.trim()) {
      handleAddPost(message);
      setIsModalOpen(false); // Close the modal
    } else {
      alert("Failed to generate post content.");
    }
  };

  return (
    <div className="other-group-posts-container">
      <h1 className="other-group-posts-title">
        Group Chat of "{group.groupname || "Group Name"}"
      </h1>

      {/* Add Post Section */}
      <div className="other-add-post-container">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write something..."
          className="other-add-post-textarea"
        />
        <button
          className="other-btn-add-post"
          onClick={() => handleAddPost(newPostContent)}
        >
          Add Post
        </button>
        <button
          className="other-btn-open-modal"
          onClick={() => setIsModalOpen(true)}
        >
          Invite a friend to watch a movie
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
              {post.userid === ownerID && (
                <span className="other-admin-label">Admin</span>
              )}
              {editPostID === post.postid ? (
                <div className="other-edit-post-container">
                  <textarea
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    placeholder="Edit your post..."
                    className="other-edit-post-textarea"
                  />
                  <div className="other-edit-post-buttons">
                    <button className="other-btn-save-post" onClick={handleEditPost}>
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
                  <div className="markdown-content">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                  <p className="other-post-meta">
                    <span className="other-post-author">
                      Posted by: {post.firstname} {post.lastname}
                    </span>
                  </p>
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

      {/* Modal */}
      {isModalOpen && (
        <MyGroupPostsModal
          onClose={() => setIsModalOpen(false)}
          onMovieCardClick={handleMovieCardClick}
        />
      )}
    </div>
  );
}

export default OtherGroupPosts;
