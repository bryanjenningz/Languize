import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App, { reducer, initialState, changeText } from "./App";

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
  expect(reducer()).toEqual(initialState);
});

it("should change text", () => {
  expect(reducer({ text: "" }, changeText("hello"))).toEqual({ text: "hello" });
});
