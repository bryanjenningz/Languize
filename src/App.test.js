import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App, { reducer, changeText, addMessage } from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={createStore(reducer)}>
      <App />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it("returns correct initial state", () => {
  expect(reducer()).toEqual({ text: "", messages: [] });
});

it("changes text", () => {
  expect(reducer({ text: "" }, changeText("hello"))).toEqual({ text: "hello" });
});

it("adds message to end of messages", () => {
  expect(
    reducer(
      { messages: [{ id: "122", text: "hi" }] },
      addMessage("123", "hello")
    )
  ).toEqual({
    text: "",
    messages: [{ id: "122", text: "hi" }, { id: "123", text: "hello" }]
  });
});
