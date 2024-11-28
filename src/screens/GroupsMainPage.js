import React from "react";
import CreateGroup from "../components/Groups_Components/CreateGroup";
import MyGroups from "../components/Groups_Components/MyGroups";
import AllGroups from "../components/Groups_Components/AllGroups"; // Import AllGroups

function GroupsPage() {
  return (
    <div className="groups-page">
      <h1>Groups</h1>

      {/* Create Group Section */}
      <CreateGroup />

      {/* My Groups Section */}
      <MyGroups />

      {/* All Groups Section */}
      <div className="all-groups-section mt-5">
        <h2>Explore Groups</h2>
        <AllGroups />
      </div>
    </div>
  );
}

export default GroupsPage;
