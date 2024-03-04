import "./test.css";
import React, { useState } from "react";
import axios from "axios"

const TestPage = (props) => {
  const [testVal, setTestVal] = useState(0);

  const [usernameInput, setusernameInput] = useState("");
  const [passwordInput, setpasswordInput] = useState("");

  const loginActive = () => {
    console.log({ usernameInput, passwordInput });
    axios
      .post("http://localhost:8080/login", {
        username: usernameInput,
        password: passwordInput,
      })
      .then((response) => {
        console.log(response);
        console.log({ usernameInput, passwordInput });
      });
  };

  const testClick = () => {
    setTestVal(testVal + 1);
  };

  const submit = () => {
    console.log({ usernameInput }, { passwordInput });
  };

  return (
    <div>
      {testVal}
      <a onClick={() => testClick()}>Click me</a>

      <br></br>
      <div>
        <span>This is username:</span>
        <input
          id="username"
          onChange={(event) => setusernameInput(event.target.value)}
        />
        <span>This is password:</span>
        <input
          id="password"
          onChange={(event) => setpasswordInput(event.target.value)}
        />
      </div>
      <a onClick={() => loginActive()}>Login</a>
    </div>
  );
};

export default TestPage;
