import React from "react";

function AddPostForm({ newPostContent, setNewPostContent, handleAddPost, movieDetails }) {
  React.useEffect(() => {
    if (movieDetails) {
      setNewPostContent((prevContent) => `${prevContent}\n\n${movieDetails}`);
    }
  }, [movieDetails, setNewPostContent]);

  return (
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
  );
}

export default AddPostForm;
