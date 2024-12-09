import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown"; // For rendering markdown content
import "./MyGroupPosts.css";
import MyGroupPostsModal from "./MyGroupPostsModal/GroupPostsModal.js";


function MyGroupPosts() {
  const { groupID } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostID, setEditPostID] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [ownerID, setOwnerID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  
  //Group Name Location Related
  const location = useLocation();
  const group = location.state?.group || {};
  //console.log("Group data from location.state:", group);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token"); // Retrieve JWT token
  
        if (!user || !token) {
          alert("Please log in to view posts.");
          return;
        }
  
        const response = await fetch(
          `http://localhost:5000/my-group-posts/${groupID}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
          }
        );
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
      const token = localStorage.getItem("token"); // Retrieve JWT token
  
      if (!user || !token) {
        alert("Please log in to add a post.");
        return;
      }
  
      const response = await fetch(
        `http://localhost:5000/my-group-posts/${groupID}/add-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
          body: JSON.stringify({
            userID: user.userid,
            content,
          }),
        }
      );
  
      if (response.ok) {
        const newPost = await response.json();
  
        // Attach the author's details to the new post
        newPost.firstname = user.firstname;
        newPost.lastname = user.lastname;
  
        // Add the new post to the state
        setPosts([newPost, ...posts]);
        setNewPostContent(""); // Reset the input field
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
      const token = localStorage.getItem("token"); // Retrieve JWT token
  
      const response = await fetch(
        `http://localhost:5000/my-group-posts/${groupID}/edit-post`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
          body: JSON.stringify({
            postID: editPostID,
            content: editPostContent,
          }),
        }
      );
  
      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.postid === editPostID
              ? { ...post, content: editPostContent }
              : post
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
      const token = localStorage.getItem("token"); // Retrieve JWT token
  
      const response = await fetch(
        `http://localhost:5000/my-group-posts/${groupID}/delete-post`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
          body: JSON.stringify({ postID }),
        }
      );
  
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

  const Post = ({ content }) => <ReactMarkdown>{content}</ReactMarkdown>;

  return (
    <div className="my-group-posts-container">
      <h1 className="my-group-posts-title">
        My Group Chat ({group.groupname || "Group Name"})
      </h1>


      {/* Add Post Section */}
      <div className="add-post-container">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write something..."
          className="add-post-textarea"
        />
        <button
          className="btn-add-post"
          onClick={() => handleAddPost(newPostContent)}
        >
          Add Post
        </button>
        <button
          className="btn-open-modal"
          onClick={() => setIsModalOpen(true)}
        >
          Invite a friend to watch a movie
        </button>
      </div>

      {/* Posts List */}
      <div className="posts-list-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.postid}
              className={`post-card ${
                post.userid === ownerID ? "admin-post" : ""
              }`}
            >
              {post.userid === ownerID && (
                <span className="admin-label">Admin</span>
              )}
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
                  {/* Styled container for markdown content */}
                  <div className="markdown-content">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                  <p className="post-meta">
                    <span className="post-author">
                      Posted by: {post.firstname} {post.lastname}
                    </span>
                  </p>
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
          <p className="no-posts-message">
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

export default MyGroupPosts;
