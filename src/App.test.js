import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App, {
  initialState,
  reducer,
  changeText,
  addMessage,
  selectMessage,
  editMessage,
  saveMessage,
  stopEditingMessage
} from "./App";

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

it("changes text", () => {
  expect(reducer({ text: "" }, changeText("hello"))).toEqual({ text: "hello" });
});

it("adds message to end of messages", () => {
  expect(
    reducer(
      { messages: [] },
      addMessage({ id: "122", text: "hi", audio: null, translation: null })
    )
  ).toEqual({
    text: "",
    messages: [{ id: "122", text: "hi", audio: null, translation: null }]
  });
});

it("selects message", () => {
  expect(reducer({ selectedMessageID: null }, selectMessage("123"))).toEqual({
    selectedMessageID: "123"
  });
});

it("edits message", () => {
  expect(
    reducer(
      { editingMessage: null },
      editMessage({ id: "122", text: "hi", audio: null, translation: null })
    )
  ).toEqual({
    editingMessage: { id: "122", text: "hi", audio: null, translation: null }
  });
});

it("saves message", () => {
  expect(
    reducer(
      { messages: [{ id: "122", text: "hi", audio: null, translation: null }] },
      saveMessage({
        id: "122",
        text: "hi",
        audio: null,
        translation: { text: "你好", audio: null }
      })
    )
  ).toEqual({
    messages: [
      {
        id: "122",
        text: "hi",
        audio: null,
        translation: { text: "你好", audio: null }
      }
    ],
    editingMessage: null
  });
});

it("stops editing message", () => {
  expect(reducer({ editingMessage: "123" }, stopEditingMessage())).toEqual({
    editingMessage: null
  });
});
