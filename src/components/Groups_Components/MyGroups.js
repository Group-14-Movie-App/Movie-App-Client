// MyGroups.js
import React from 'react';

function MyGroups({ groups, onDelete }) {
    return (
        <div className="my-groups">
            <h2>My Groups</h2>
            {groups.map((group) => (
                <div key={group.id} className="group-card">
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <button onClick={() => onDelete(group.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default MyGroups;
