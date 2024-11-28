import React from "react";

function EditPostForm({ editPostContent, setEditPostContent, handleEditPost, cancelEdit }) {
  return (
    <>
      <textarea
        value={editPostContent}
        onChange={(e) => setEditPostContent(e.target.value)}
        placeholder="Edit your post..."
      />
      <button className="btn btn-success" onClick={handleEditPost}>
        Save
      </button>
      <button className="btn btn-secondary" onClick={cancelEdit}>
        Cancel
      </button>
    </>
  );
}

export default EditPostForm;
