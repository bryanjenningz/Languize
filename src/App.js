// @flow
import React from "react";
import { connect } from "react-redux";

type ID = string;

type Audio = string;

type Translation = {
  text: string,
  audio: ?Audio
};

type Message = {
  id: ID,
  text: string,
  audio: ?Audio,
  translation: ?Translation
};

type State = {
  text: string,
  messages: Message[],
  selectedMessageID: ?ID,
  editingMessage: ?Message
};

type Action =
  | {| type: "CHANGE_TEXT", text: string |}
  | {| type: "ADD_MESSAGE", message: Message |}
  | {| type: "SELECT_MESSAGE", messageID: ?ID |}
  | {| type: "EDIT_MESSAGE", message: Message |}
  | {| type: "SAVE_MESSAGE", message: Message |}
  | {| type: "STOP_EDITING_MESSAGE" |};

export const changeText: string => Action = text => ({
  type: "CHANGE_TEXT",
  text
});
export const addMessage: Message => Action = message => ({
  type: "ADD_MESSAGE",
  message
});
export const selectMessage: (?ID) => Action = messageID => ({
  type: "SELECT_MESSAGE",
  messageID
});
export const editMessage: Message => Action = message => ({
  type: "EDIT_MESSAGE",
  message
});
export const saveMessage: Message => Action = message => ({
  type: "SAVE_MESSAGE",
  message
});
export const stopEditingMessage: () => Action = () => ({
  type: "STOP_EDITING_MESSAGE"
});

export const initialState: State = {
  text: "",
  messages: [
    { id: "1", text: "Hello", audio: null, translation: null },
    {
      id: "2",
      text: "你好",
      audio: null,
      translation: { text: "hello", audio: null }
    },
    {
      id: "3",
      text:
        "Hi, how are you doing? I'm doing pretty well. I'm glad we get to talk on this app. It's so cool!",
      audio: null,
      translation: null
    },
    {
      id: "4",
      text: "不错，我也很高兴认识你！",
      audio: null,
      translation: null
    },
    {
      id: "5",
      text: "Your Chinese is soooooo gooood! How did you learn?",
      audio: null,
      translation: {
        text: "你的中文真棒！你怎么学的？",
        audio: null
      }
    }
  ],
  selectedMessageID: null,
  editingMessage: null
};

export const reducer: (State, Action) => State = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "CHANGE_TEXT":
      return { ...state, text: action.text };
    case "ADD_MESSAGE":
      return {
        ...state,
        text: "",
        messages: state.messages.concat(action.message)
      };
    case "SELECT_MESSAGE":
      return {
        ...state,
        selectedMessageID: action.messageID
      };
    case "EDIT_MESSAGE":
      return {
        ...state,
        editingMessage: action.message
      };
    case "SAVE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map(
          m => (m.id === action.message.id ? action.message : m)
        ),
        editingMessage: null
      };
    case "STOP_EDITING_MESSAGE":
      return {
        ...state,
        editingMessage: null
      };
    default:
      return state;
  }
};

const randomId: () => string = () => String(Math.random()).slice(2);

type ActionCreators = {
  changeText: string => Action,
  addMessage: Message => Action,
  selectMessage: ID => Action,
  editMessage: Message => Action,
  saveMessage: Message => Action,
  stopEditingMessage: () => Action
};

type AppProps = {|
  ...State,
  ...ActionCreators
|};

const App: AppProps => React$Element<*> = ({
  text,
  messages,
  selectedMessageID,
  editingMessage,
  changeText,
  addMessage,
  selectMessage,
  editMessage,
  saveMessage,
  stopEditingMessage
}) => (
  <div
    style={{
      textAlign: "center",
      maxWidth: 700,
      margin: "0 auto",
      height: "100vh",
      padding: 10
    }}
  >
    {editingMessage ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 1
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1
          }}
          onClick={e => {
            e.stopPropagation();
            stopEditingMessage();
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: "100%",
              zIndex: 2,
              padding: "0 10px"
            }}
            onClick={e => {
              if (e.currentTarget === e.target) {
                e.stopPropagation();
                stopEditingMessage();
              }
            }}
          >
            <div
              style={{
                maxWidth: 680,
                margin: "0 auto",
                height: 270,
                backgroundColor: "#eee",
                paddingTop: 25
              }}
            >
              <textarea
                value={editingMessage.text}
                onChange={e => {
                  editMessage({ ...editingMessage, text: e.target.value });
                }}
                placeholder="Enter text"
                style={{
                  width: "80%",
                  height: 70,
                  fontSize: 15,
                  marginBottom: 10,
                  border: 0
                }}
              />
              <textarea
                value={
                  editingMessage.translation
                    ? editingMessage.translation.text
                    : ""
                }
                onChange={e => {
                  if (editingMessage) {
                    editMessage({
                      ...editingMessage,
                      translation: {
                        ...(editingMessage.translation || {
                          text: "",
                          audio: null
                        }),
                        text: e.target.value
                      }
                    });
                  }
                }}
                placeholder="Enter translation"
                style={{
                  width: "80%",
                  height: 70,
                  fontSize: 15,
                  marginBottom: 10,
                  border: 0
                }}
              />
              <div
                style={{
                  display: "flex",
                  width: "80%",
                  margin: "0 auto",
                  height: 50
                }}
              >
                <div
                  style={{
                    flex: 1,
                    color: "white",
                    backgroundColor: "#13c713",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    if (
                      editingMessage &&
                      editingMessage.text.trim() &&
                      (!editingMessage.translation ||
                        editingMessage.translation.text.trim())
                    ) {
                      saveMessage(editingMessage);
                    }
                  }}
                >
                  ✔
                </div>
                <div
                  style={{
                    flex: 1,
                    color: "white",
                    backgroundColor: "#c71334",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                  onClick={stopEditingMessage}
                >
                  ✖
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null}
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 9, overflow: "auto" }}>
        {messages.map((m, i) => (
          <div
            key={m.id}
            style={{
              width: "80%",
              padding: 30,
              marginBottom: 20,
              backgroundColor: "white",
              fontSize: 20,
              position: "relative",
              left: i % 2 === 1 ? "20%" : 0
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 15,
                cursor: "pointer"
              }}
              onClick={() => {
                editMessage({
                  id: m.id,
                  text: m.text,
                  audio: m.audio,
                  translation: m.translation
                    ? { text: m.translation.text, audio: m.translation.audio }
                    : null
                });
              }}
            >
              ✎
            </div>
            {m.translation ? (
              <div
                style={
                  m.id === selectedMessageID
                    ? {
                        position: "absolute",
                        top: 10,
                        right: 15,
                        fontSize: 25,
                        userSelect: "none",
                        cursor: "pointer"
                      }
                    : {
                        position: "absolute",
                        top: -20,
                        right: 10,
                        fontSize: 50,
                        userSelect: "none",
                        cursor: "pointer"
                      }
                }
                onClick={e => {
                  e.stopPropagation();
                  selectMessage(m.id === selectedMessageID ? null : m.id);
                }}
              >
                {m.id === selectedMessageID ? "⌃" : "⌄"}
              </div>
            ) : null}
            {m.text}
            {m.translation && m.id === selectedMessageID ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    borderTop: "1px solid #aaa",
                    marginTop: 10,
                    paddingTop: 10
                  }}
                >
                  <div>{m.translation.text}</div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          height: 50,
          marginTop: 10
        }}
      >
        <input
          placeholder="Enter text here"
          onChange={e => changeText(e.target.value)}
          value={text}
          style={{
            width: "80%",
            textAlign: "center",
            fontSize: 20,
            border: 0
          }}
        />
        <div
          onClick={() =>
            addMessage({ id: randomId(), text, audio: null, translation: null })
          }
          style={{
            width: "20%",
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            backgroundColor: "#13c713",
            color: "white"
          }}
        >
          +
        </div>
      </div>
    </div>
  </div>
);

const mapState: State => State = state => state;

const mapDispatch: ActionCreators = {
  changeText,
  addMessage,
  selectMessage,
  editMessage,
  saveMessage,
  stopEditingMessage
};

export default connect(mapState, mapDispatch)(App);
