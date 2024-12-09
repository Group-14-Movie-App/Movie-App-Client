import React from "react";
import CreateGroup from "../components/Groups_Components/CreateGroup";
import MyGroups from "../components/Groups_Components/MyGroups";
import AllGroups from "../components/Groups_Components/AllGroups"; // Import AllGroups
import './screensStyles/GroupsMainPage.css'

function GroupsPage() {
  return (
    <div className="groups-page-container">
      <h1 className="groups-page-title">Group Chats</h1>

      {/* Create Group Section */}
      <div className="create-group-section">
        <CreateGroup />
      </div>

      {/* My Groups Section */}
      <div className="my-groups-section">
        <MyGroups />
      </div>

      {/* All Groups Section */}
      <div className="all-groups-section">
        <h2 className="section-title-1">Explore Groups</h2>
        <AllGroups />
      </div>
    </div>
  );
}

export default GroupsPage;
