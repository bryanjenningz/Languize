import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App, {
  reducer,
  changeText,
  addMessage,
  selectMessage,
  editMessage,
  saveMessage,
  stopEditingMessage,
  openRecorder,
  startRecording,
  stopRecording,
  saveRecording,
  closeRecorder
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

it("opens recorder", () => {
  expect(reducer({ audioRecording: null }, openRecorder("123"))).toEqual({
    audioRecording: { type: "WAITING_TO_RECORD", messageID: "123" }
  });
});

it("starts recording", () => {
  expect(
    reducer(
      { audioRecording: { type: "WAITING_TO_RECORD", messageID: "123" } },
      startRecording()
    )
  ).toEqual({ audioRecording: { type: "RECORDING", messageID: "123" } });
});

it("stops recording", () => {
  expect(
    reducer(
      { audioRecording: { type: "RECORDING", messageID: "123" } },
      stopRecording("blah.mp3")
    )
  ).toEqual({
    audioRecording: {
      type: "DONE_RECORDING",
      recording: "blah.mp3",
      messageID: "123"
    }
  });
});

it("saves recording", () => {
  expect(
    reducer(
      {
        audioRecording: {
          type: "DONE_RECORDING",
          recording: "blah.mp3",
          messageID: "123"
        },
        messages: [
          {
            id: "123",
            text: "hi",
            audio: null,
            translation: { text: "blah", audio: null }
          }
        ]
      },
      saveRecording()
    )
  ).toEqual({
    audioRecording: null,
    messages: [
      {
        id: "123",
        text: "hi",
        audio: null,
        translation: { text: "blah", audio: "blah.mp3" }
      }
    ]
  });
});

it("closes the recorder", () => {
  expect(
    reducer(
      {
        audioRecording: { type: "DONE_RECORDING", recording: "blah.mp3" },
        messages: [
          {
            id: "123",
            text: "hi",
            audio: null,
            translation: { text: "blah", audio: null }
          }
        ]
      },
      closeRecorder()
    )
  ).toEqual({
    audioRecording: null,
    messages: [
      {
        id: "123",
        text: "hi",
        audio: null,
        translation: { text: "blah", audio: null }
      }
    ]
  });
});
