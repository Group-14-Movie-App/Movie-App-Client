// GroupsMainPage.js
import React, { useState } from 'react';
import CreateGroup from '../components/Groups_Components/CreateGroup.js';
import MyGroups from '../components/Groups_Components/MyGroups.js';
import AllGroups from '../components/Groups_Components/AllGroups.js';
import './screensStyles/GroupPage.css';

function GroupsMainPage() {
    const [myGroups, setMyGroups] = useState([]);
    const [allGroups, setAllGroups] = useState([]);

    const handleCreateGroup = (newGroup) => {
        // Add the new group to myGroups and allGroups lists
        setMyGroups([...myGroups, newGroup]);
        setAllGroups([...allGroups, { ...newGroup, joined: true }]);
    };

    const handleDeleteGroup = (id) => {
        setMyGroups(myGroups.filter((group) => group.id !== id));
        setAllGroups(allGroups.filter((group) => group.id !== id));
    };

    const handleRequestJoin = (id) => {
        setAllGroups(
            allGroups.map((group) =>
                group.id === id ? { ...group, joined: true } : group
            )
        );
    };

    return (
        <div className="groups-main-page">
            <CreateGroup onCreate={handleCreateGroup} />
            <MyGroups groups={myGroups} onDelete={handleDeleteGroup} />
            <AllGroups groups={allGroups} onRequestJoin={handleRequestJoin} />
        </div>
    );
}

export default GroupsMainPage;
