import React from "react";
import { connect } from "react-redux";
import AppBar from "./AppBar";

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    const start = () => {
      mediaRecorder.start();
      return stop;
    };

    resolve(start);
  });

export const initialState = {
  text: "",
  messages: [
    {
      id: "1",
      text: "Hello",
      audio: "",
      translation: "",
      translationAudio: ""
    },
    {
      id: "2",
      text: "你好",
      audio: "",
      translation: "hello",
      translationAudio: ""
    },
    {
      id: "3",
      text:
        "Hi, how are you doing? I'm doing pretty well. I'm glad we get to talk on this app. It's so cool!",
      audio: "",
      translation: "",
      translationAudio: ""
    },
    {
      id: "4",
      text: "不错，我也很高兴认识你！",
      audio: "",
      translation: "",
      translationAudio: ""
    },
    {
      id: "5",
      text: "Your Chinese is soooooo gooood! How did you learn?",
      audio: "",
      translation: "你的中文真棒！你怎么学的？",
      translationAudio: ""
    }
  ],
  editing: null
};

export const changeText = text => ({ type: "CHANGE_TEXT", text });
export const addMessage = message => ({ type: "ADD_MESSAGE", message });
export const startEditingMessage = message => ({
  type: "START_EDITING_MESSAGE",
  message
});
export const editText = text => ({ type: "EDIT_TEXT", text });
export const editTranslation = translation => ({
  type: "EDIT_TRANSLATION",
  translation
});
export const startRecording = ({ audioPromise, isTranslation }) => ({
  type: "START_RECORDING",
  audioPromise,
  isTranslation
});
export const stopRecording = audio => ({ type: "STOP_RECORDING", audio });
export const saveMessage = message => ({ type: "SAVE_MESSAGE" });
export const cancelEditingMessage = () => ({ type: "CANCEL_EDITING_MESSAGE" });

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_TEXT":
      return { ...state, text: action.text };
    case "ADD_MESSAGE":
      return {
        ...state,
        text: "",
        messages: state.messages.concat(action.message)
      };
    case "START_EDITING_MESSAGE":
      return {
        ...state,
        editing: {
          message: action.message,
          recording: null
        }
      };
    case "EDIT_TEXT":
      return {
        ...state,
        editing: {
          ...state.editing,
          message: { ...state.editing.message, text: action.text }
        }
      };
    case "EDIT_TRANSLATION":
      return {
        ...state,
        editing: {
          ...state.editing,
          message: { ...state.editing.message, translation: action.translation }
        }
      };
    case "START_RECORDING":
      return {
        ...state,
        editing: {
          message: state.editing.message,
          recording: {
            audioPromise: action.audioPromise,
            isTranslation: action.isTranslation
          }
        }
      };
    case "STOP_RECORDING":
      return {
        ...state,
        editing: {
          message: {
            ...state.editing.message,
            [state.editing.recording.isTranslation
              ? "translationAudio"
              : "audio"]: action.audio
          },
          recording: null
        }
      };
    case "SAVE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map(
          m => (m.id === state.editing.message.id ? state.editing.message : m)
        ),
        editing: null
      };
    case "CANCEL_EDITING_MESSAGE":
      return {
        ...state,
        editing: null
      };
    default:
      return state;
  }
};

const randomId = () => String(Math.random()).slice(2);

const App = ({
  text,
  messages,
  editing,
  changeText,
  addMessage,
  startEditingMessage,
  editText,
  editTranslation,
  startRecording,
  stopRecording,
  saveMessage,
  cancelEditingMessage
}) => (
  <div>
    <AppBar />
    <div
      style={{
        textAlign: "center",
        maxWidth: 700,
        margin: "0 auto",
        height: "100vh",
        padding: "55px 10px 10px 10px"
      }}
    >
      {editing ? (
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
              cancelEditingMessage();
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
                  cancelEditingMessage();
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
                  value={editing.message.text}
                  onChange={e => {
                    editText(e.target.value);
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
                  value={editing.message.translation}
                  onChange={e => {
                    editTranslation(e.target.value);
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
                    onClick={saveMessage}
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
                    onClick={cancelEditingMessage}
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
                margin: "20px 0",
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
                onClick={e => {
                  e.stopPropagation();
                  startEditingMessage(m);
                }}
              >
                ✎
              </div>
              {m.audio ? (
                <div
                  style={{
                    position: "absolute",
                    left: 15,
                    top: 15,
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    new Audio(m.audio).play();
                  }}
                >
                  <span role="img" aria-label="play text audio">
                    🔊
                  </span>
                </div>
              ) : null}
              {m.translationAudio ? (
                <div
                  style={{
                    position: "absolute",
                    left: 15,
                    bottom: 15,
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    new Audio(m.translationAudio).play();
                  }}
                >
                  <span role="img" aria-label="play translation audio">
                    🔊
                  </span>
                </div>
              ) : null}
              {m.text}
              {m.translation ? (
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
                    <div>{m.translation}</div>
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
              addMessage({
                id: randomId(),
                text,
                audio: "",
                translation: "",
                translationAudio: ""
              })
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
  </div>
);

const mapState = state => state;

const mapDispatch = {
  changeText,
  addMessage,
  startEditingMessage,
  editText,
  editTranslation,
  saveMessage,
  cancelEditingMessage,
  startRecording,
  stopRecording
};

export default connect(mapState, mapDispatch)(App);
