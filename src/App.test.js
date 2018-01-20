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
  expandMessage,
  startRecording,
  stopRecording,
  saveRecording
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
      { messages: [{ id: "122", text: "hi", notes: [] }] },
      addMessage("123", "hello")
    )
  ).toEqual({
    text: "",
    messages: [
      { id: "122", text: "hi", notes: [] },
      { id: "123", text: "hello", notes: [] }
    ]
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
  expect(
    reducer(
      {
        expandedMessage: null,
        messages: [
          {
            id: "messageId",
            text: "hi",
            notes: [
              {
                id: "noteId",
                messageId: "messageId",
                text: "hi",
                translation: "你好",
                textAudio: "",
                translationAudio: "hello.mp3"
              }
            ]
          }
        ]
      },
      expandMessage("messageId")
    )
  ).toEqual({
    expandedMessage: {
      id: "messageId",
      translationAudio: ""
    },
    messages: [
      {
        id: "messageId",
        text: "hi",
        notes: [
          {
            id: "noteId",
            messageId: "messageId",
            text: "hi",
            translation: "你好",
            textAudio: "",
            translationAudio: "hello.mp3"
          }
        ]
      }
    ]
  });
});

it("sets recording state to true when recording", () => {
  expect(reducer({ recording: false }, startRecording())).toEqual({
    recording: true
  });
});

it("stops recording", () => {
  expect(
    reducer(
      { recording: true, expandedMessage: { id: "123", translationAudio: "" } },
      stopRecording("blah.mp3")
    )
  ).toEqual({
    recording: false,
    expandedMessage: { id: "123", translationAudio: "blah.mp3" }
  });
});

it("saves recording to message note", () => {
  expect(
    reducer(
      {
        recording: false,
        expandedMessage: { id: "messageId", translationAudio: "hello.mp3" },
        messages: [
          {
            id: "messageId",
            text: "hi",
            notes: [
              {
                id: "noteId",
                messageId: "messageId",
                text: "hi",
                translation: "你好",
                textAudio: "",
                translationAudio: ""
              }
            ]
          }
        ]
      },
      saveRecording("blah.mp3")
    )
  ).toEqual({
    recording: false,
    expandedMessage: null,
    messages: [
      {
        id: "messageId",
        text: "hi",
        notes: [
          {
            id: "noteId",
            messageId: "messageId",
            text: "hi",
            translation: "你好",
            textAudio: "",
            translationAudio: "hello.mp3"
          }
        ]
      }
    ]
  });
});
