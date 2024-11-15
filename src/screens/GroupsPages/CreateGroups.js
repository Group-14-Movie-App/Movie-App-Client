import React, { useState } from 'react';
import '../screensStyles/CreateGroup.css';

function CreateGroupsPage() {
  const [myGroups, setMyGroups] = useState([
    { id: 1, name: 'My Group 1', description: 'This is my first group' },
    { id: 2, name: 'My Group 2', description: 'This is my second group' }
  ]);
  const [allGroups, setAllGroups] = useState([
    { id: 1, name: 'My Group 1', description: 'This is my first group' },
    { id: 2, name: 'My Group 2', description: 'This is my second group' },
    { id: 3, name: 'Group 3', description: 'Another group' },
    { id: 4, name: 'Group 4', description: 'Yet another group' }
  ]);
  const [requestedGroups, setRequestedGroups] = useState([]);

  // Delete handler function for My Groups
  const deleteGroup = (groupId) => {
    setMyGroups(myGroups.filter(group => group.id !== groupId));
    setAllGroups(allGroups.filter(group => group.id !== groupId));
  };

  // Request to Join function
  const requestToJoin = (groupId) => {
    if (!requestedGroups.includes(groupId)) {
      setRequestedGroups([...requestedGroups, groupId]);
    }
  };

  return (
    <div className="main-content">
      {/* Create Group Form */}
      <section className="create-group">
        <h2>Create a Group</h2>
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" placeholder="Enter group name" />
          <label htmlFor="description">Group Description:</label>
          <textarea id="description" placeholder="Enter group description"></textarea>
          <button type="submit" className="submit-btn">Create Group</button>
        </form>
      </section>

      {/* My Groups List */}
      <section className="my-groups">
        <h3>My Groups</h3>
        <ul className="group-list">
          {myGroups.map(group => (
            <li className="group-item" key={group.id}>
              <div className="group-info">
                <strong>{group.name}</strong>
                <p>{group.description}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteGroup(group.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* All Groups List */}
      <section className="all-groups">
        <h3>All Groups</h3>
        <ul className="group-list">
          {allGroups.map(group => (
            <li className="group-item" key={group.id}>
              <div className="group-info">
                <strong>{group.name}</strong>
                <p>{group.description}</p>
              </div>
              {myGroups.some(myGroup => myGroup.id === group.id) ? (
                <p className="joined-label">Already Joined</p>
              ) : (
                <button
                  className="join-btn"
                  onClick={() => requestToJoin(group.id)}
                  disabled={requestedGroups.includes(group.id)}
                >
                  {requestedGroups.includes(group.id) ? "Requested" : "Request to Join"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default CreateGroupsPage;
