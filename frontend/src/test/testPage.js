import "./test.css";
import React, {useState} from "react";
// double check the useState after get home

const TestPage =  (props) =>{
    
    const [testVal, setTestVal] = useState(0);

    const [userName, setUsername] = useState("");

    const testClick = () => {
        setTestVal(testVal + 1);
    }

    const submit = () => {
        console.log(userName);
    }
    
    return(
        <div>
            {testVal}
            <a onClick={() => testClick()}>Click me</a>

            <br></br>
            <input id="username-" onChange={(event) => setUsername(event.target.value)}/>
            <a onClick={() => submit()}>Login</a>
        </div>
    )
}

export default TestPage;

