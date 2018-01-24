import {
  reducer,
  startEditingMessage,
  editText,
  editTranslation,
  saveMessage,
  cancelEditingMessage,
  startRecording,
  stopRecording
} from "./reducer";

const message = {
  id: "122",
  text: "hi",
  audio: "",
  translation: "",
  translationAudio: ""
};

it("adds message to end of messages when message id isn't in messages", () => {
  expect(
    reducer(
      { messages: [], editing: { message, recording: null } },
      saveMessage()
    )
  ).toEqual({
    messages: [message],
    editing: null
  });
});

it("starts editing message", () => {
  expect(
    reducer(
      { editing: null, messages: [message] },
      startEditingMessage(message)
    )
  ).toEqual({ messages: [message], editing: { message, recording: null } });
});

it("edits text", () => {
  expect(
    reducer({ editing: { message, recording: null } }, editText("helldfasfo"))
  ).toEqual({
    editing: { message: { ...message, text: "helldfasfo" }, recording: null }
  });
});

it("edits translation", () => {
  expect(
    reducer(
      { editing: { message, recording: null } },
      editTranslation("helldfasfo")
    )
  ).toEqual({
    editing: {
      message: { ...message, translation: "helldfasfo" },
      recording: null
    }
  });
});

it("saves message", () => {
  const newMessage = {
    ...message,
    text: "aaaaa",
    translation: "bbbbb",
    audio: "ccc",
    translationAudio: "dddd"
  };
  expect(
    reducer(
      { messages: [message], editing: { message: newMessage } },
      saveMessage()
    )
  ).toEqual({
    messages: [
      {
        ...message,
        text: "aaaaa",
        translation: "bbbbb",
        audio: "ccc",
        translationAudio: "dddd"
      }
    ],
    editing: null
  });
});

it("cancels editing message", () => {
  expect(
    reducer({ editing: { message, recording: null } }, cancelEditingMessage())
  ).toEqual({ editing: null });
});

it("starts recording", () => {
  expect(
    reducer(
      { editing: { message, recording: null } },
      startRecording({
        audioPromise: Promise.resolve("hey"),
        isTranslation: true
      })
    )
  ).toEqual({
    editing: {
      message,
      recording: { audioPromise: Promise.resolve("hey"), isTranslation: true }
    }
  });
});

it("stop recording, is translation", () => {
  expect(
    reducer(
      {
        editing: {
          message,
          recording: {
            audioPromise: Promise.resolve("hey"),
            isTranslation: true
          }
        }
      },
      stopRecording("hey.mp3")
    )
  ).toEqual({
    editing: {
      message: { ...message, translationAudio: "hey.mp3" },
      recording: null
    }
  });
});

it("stop recording, isn't translation", () => {
  expect(
    reducer(
      {
        editing: {
          message,
          recording: {
            audioPromise: Promise.resolve("hey"),
            isTranslation: false
          }
        }
      },
      stopRecording("hey.mp3")
    )
  ).toEqual({
    editing: {
      message: { ...message, audio: "hey.mp3" },
      recording: null
    }
  });
});
