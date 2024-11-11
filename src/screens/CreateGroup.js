import { useRef } from "react";

function CreateGroup()
{
    const groupName = useRef(null)

    const handleSubmit = (event)=>
    {
        event.preventDefault();

        console.log("Submitted");
        console.log(groupName.current.value);


        /*
        fetch('http://localhost:5000/create-group/',
            {
                method: 'GET',
                headers:
                {
                    "Content-Type":"application/json"
                }
            }
        )

        .then((response)=> response.json())

        .then((response)=>
        {
            console.log(response)
        })
        */

        const requstPayLoad = JSON.stringify({group_name:groupName.current.value})

        fetch('http://localhost:5000/create-group/',
            {
                method: 'POST',
                headers:
                {
                    "Content-Type":"application/json"
                },
                body: requstPayLoad
            }
        )

        .then((response)=> response.json())

        .then((response)=>
        {
            console.log(response)
        })

    }



    return(
        <div>
            <form onSubmit={handleSubmit}>

                <div>

                    <label> Group Name </label>
                    <input 
                        type="text"
                        ref={groupName}

                    />
                </div>

                <button type="submit">Submit</button>
                
            </form>
        </div>
    )

}


export default CreateGroup;