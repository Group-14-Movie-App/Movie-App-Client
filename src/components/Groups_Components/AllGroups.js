// AllGroups.js
import React from 'react';

function AllGroups({ groups, onRequestJoin }) {
    return (
        <div className="all-groups">
            <h2>All Groups</h2>
            {groups.map((group) => (
                <div key={group.id} className="group-card">
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <button onClick={() => onRequestJoin(group.id)}>
                        {group.joined ? 'Already Joined' : 'Request to Join'}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default AllGroups;
