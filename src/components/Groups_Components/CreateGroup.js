import React, { useState } from 'react';

function CreateGroup({ onCreate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Retrieve the logged-in user's data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));  // Assuming the logged-in user is stored in localStorage as 'user'

        // Check if the user is logged in and has a valid user ID
        if (!user || !user.userid) {
            setError("You must be logged in to create a group.");
            return;
        }

        const ownerID = user.userid;  // Use the logged-in user's ID as the ownerID

        // Debugging logs
        console.log("Group Name:", name);
        console.log("Group Description:", description);
        console.log("Owner ID:", ownerID);

        // Ensure that the group name and description are provided
        if (!name || !description) {
            setError("Both group name and description are required.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/CreateGroup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    groupName: name,  
                    description, 
                    ownerID,       // Send the logged-in user's ID as ownerID
                }),
        
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Group created:", data);
                setSuccess("Group created successfully!");
                setName('');
                setDescription('');
                onCreate(data.group); // Notify parent component about the new group
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to create group.");
            }
        } catch (err) {
            console.error("Error creating group:", err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="create-group">
            <h1>Create a Group</h1>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Group Name</label>
                    <input
                        type="text"
                        placeholder="Enter group name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Group Description</label>
                    <textarea
                        placeholder="Enter group description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
}

export default CreateGroup;
