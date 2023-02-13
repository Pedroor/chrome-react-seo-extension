/*global chrome*/
import React, { useEffect, useState } from "react";
import { DOMMessageResponse } from "./Types";
import "./app.css";
import FormInput from "./components/FormInput";
import api from "./services/api";

const App = () => {
  const [values, setValues] = useState({
    username: "",
    phoneNumber: "",
  });

  const [title, setTitle] = React.useState("");
  const [headlines, setHeadlines] = React.useState([]);

  useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          /**
           * Sends a single message to the content script(s) in the specified tab,
           * with an optional callback to run when a response is sent back.
           *
           * The runtime.onMessage event is fired in each content script running
           * in the specified tab for the current extension.
           */
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "GET_DOM" },
            (response: DOMMessageResponse) => {
              setTitle(response.title);
              setHeadlines(response.headlines);
            }
          );
        }
      );
  }, []);

  useEffect(() => {
    console.log({ title, headlines });
  }, []);

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      label: "Username",
      required: true,
    },
    {
      id: 2,
      name: "phoneNumber",
      type: "phoneNumber",
      placeholder: "Phone Number",
      label: "Phone Number",
      required: true,
    },
  ];

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await api.post("/register", { values });
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValues({ ...values, [e?.target?.name]: e?.target?.value });
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default App;
