import {
  reducer,
  startEditingMessage,
  editText,
  editTranslation,
  saveMessage,
  cancelEditingMessage,
  startRecording,
  stopRecording,
  selectChatID,
  changeRoute
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
      {
        selectedChatID: "123",
        chats: [{ id: "123", messages: [] }],
        editing: { message, recording: null }
      },
      saveMessage()
    )
  ).toEqual({
    selectedChatID: "123",
    chats: [{ id: "123", messages: [message] }],
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
      {
        selectedChatID: "234",
        chats: [{ id: "234", messages: [message] }],
        editing: { message: newMessage }
      },
      saveMessage()
    )
  ).toEqual({
    selectedChatID: "234",
    chats: [
      {
        id: "234",
        messages: [newMessage]
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

it("unselects chat ID", () => {
  expect(
    reducer(
      {
        selectedChatID: "c123",
        chats: [{ id: "c123" }]
      },
      selectChatID(null)
    )
  ).toEqual({ selectedChatID: null, chats: [{ id: "c123" }] });
});

it("removes unread messages when messages are seen", () => {
  expect(
    reducer(
      {
        chats: [{ id: "c123", unreadMessageCount: 2 }],
        selectedChatID: null
      },
      selectChatID("c123")
    )
  ).toEqual({
    chats: [{ id: "c123", unreadMessageCount: 0 }],
    selectedChatID: "c123"
  });
});

it("changes route", () => {
  expect(
    reducer(
      {
        route: "hello"
      },
      changeRoute("hi")
    )
  ).toEqual({ route: "hi" });
});
