import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App, {
  initialState,
  reducer,
  changeText,
  addMessage,
  addNote,
  editNote,
  cancelNote,
  expandMessage
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

it("returns correct initial state", () => {
  expect(reducer()).toEqual(initialState);
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

it("adds a note to a message", () => {
  expect(
    reducer(
      {
        messages: [
          { id: "1", text: "hi", notes: [] },
          { id: "23", text: "hello", notes: [] }
        ]
      },
      addNote({
        id: "1111",
        messageId: "23",
        text: "hello",
        translation: "你好",
        textAudio: "hello.mp3",
        translationAudio: "你好.mp3"
      })
    )
  ).toEqual({
    editingNote: null,
    messages: [
      { id: "1", text: "hi", notes: [] },
      {
        id: "23",
        text: "hello",
        notes: [
          {
            id: "1111",
            messageId: "23",
            text: "hello",
            translation: "你好",
            textAudio: "hello.mp3",
            translationAudio: "你好.mp3"
          }
        ]
      }
    ]
  });
});

it("edits a note for a message id", () => {
  expect(
    reducer(
      {
        editingNote: null
      },
      editNote({
        id: "12",
        messageId: "23",
        text: "hey",
        translation: "你好！",
        textAudio: "hey.mp3",
        translationAudio: "你好！.mp3"
      })
    )
  ).toEqual({
    editingNote: {
      id: "12",
      messageId: "23",
      text: "hey",
      translation: "你好！",
      textAudio: "hey.mp3",
      translationAudio: "你好！.mp3"
    }
  });
});

it("cancels editing the note", () => {
  expect(reducer({ editingNote: {} }, cancelNote())).toEqual({
    editingNote: null
  });
});

it("sets expanded message id", () => {
  expect(reducer({ expandedMessageId: null }, expandMessage("123"))).toEqual({
    expandedMessageId: "123"
  });
});
