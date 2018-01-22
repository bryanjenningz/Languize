import React from "react";
import { connect } from "react-redux";

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

export const changeText = text => ({
  type: "CHANGE_TEXT",
  text
});
export const addMessage = message => ({
  type: "ADD_MESSAGE",
  message
});
export const selectMessage = messageID => ({
  type: "SELECT_MESSAGE",
  messageID
});
export const editMessage = message => ({
  type: "EDIT_MESSAGE",
  message
});
export const saveMessage = message => ({
  type: "SAVE_MESSAGE",
  message
});
export const stopEditingMessage = () => ({
  type: "STOP_EDITING_MESSAGE"
});
export const openRecorder = messageID => ({
  type: "OPEN_RECORDER",
  messageID
});
export const startRecording = recordingPromise => ({
  type: "START_RECORDING",
  recordingPromise
});
export const stopRecording = recording => ({
  type: "STOP_RECORDING",
  recording
});
export const saveRecording = () => ({
  type: "SAVE_RECORDING"
});
export const closeRecorder = () => ({
  type: "CLOSE_RECORDER"
});

export const initialState = {
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
  editingMessage: null,
  audioRecording: null
};

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
    case "OPEN_RECORDER":
      return {
        ...state,
        audioRecording: {
          type: "WAITING_TO_RECORD",
          messageID: action.messageID
        }
      };
    case "START_RECORDING":
      return {
        ...state,
        audioRecording: {
          type: "RECORDING",
          messageID: state.audioRecording.messageID,
          recordingPromise: action.recordingPromise
        }
      };
    case "STOP_RECORDING":
      return {
        ...state,
        audioRecording: {
          type: "DONE_RECORDING",
          recording: action.recording,
          messageID: state.audioRecording.messageID
        }
      };
    case "SAVE_RECORDING":
      return {
        ...state,
        messages: state.messages.map(
          m =>
            m.id === state.audioRecording.messageID
              ? {
                  ...m,
                  translation: {
                    ...(m.translation || { text: "" }),
                    audio: state.audioRecording.recording
                  }
                }
              : m
        ),
        audioRecording: null
      };
    case "CLOSE_RECORDER":
      return {
        ...state,
        audioRecording: null
      };
    default:
      return state;
  }
};

const randomId = () => String(Math.random()).slice(2);

const App = ({
  text,
  messages,
  selectedMessageID,
  editingMessage,
  audioRecording,
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
    {audioRecording ? (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1
          }}
          onClick={e => {
            e.stopPropagation();
            if (e.currentTarget === e.target) {
              closeRecorder();
            }
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center"
          }}
        >
          <div
            style={{
              height: 230,
              width: "100vw",
              zIndex: 2
            }}
            onClick={e => {
              e.stopPropagation();
              if (e.currentTarget === e.target) {
                closeRecorder();
              }
            }}
          >
            <div
              style={{
                maxWidth: 680,
                height: "100%",
                backgroundColor: "white",
                margin: "0 auto",
                padding: 20
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 50,
                  fontSize: 20,
                  backgroundColor:
                    audioRecording.type === "RECORDING" ? "#c71334" : "#13c713",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  marginBottom: 20
                }}
                onClick={async e => {
                  e.stopPropagation();
                  if (audioRecording.type === "RECORDING") {
                    const {
                      audioUrl
                    } = await audioRecording.recordingPromise();
                    stopRecording(audioUrl);
                  } else {
                    const start = await recordAudio();
                    startRecording(start());
                  }
                }}
              >
                {audioRecording.type === "RECORDING" ? "STOP" : "RECORD"}
              </div>
              <div
                style={{
                  width: "100%",
                  height: 50,
                  fontSize: 20,
                  backgroundColor: "#13c713",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  marginBottom: 20,
                  visibility:
                    audioRecording.type === "DONE_RECORDING" ? "" : "hidden"
                }}
                onClick={e => {
                  e.stopPropagation();
                  new Audio(audioRecording.recording).play();
                }}
              >
                PLAY AUDIO
              </div>
              <div
                style={{
                  width: "100%",
                  height: 50,
                  fontSize: 20,
                  backgroundColor:
                    audioRecording.type === "DONE_RECORDING"
                      ? "#13c713"
                      : "#cccccc",
                  color:
                    audioRecording.type === "DONE_RECORDING"
                      ? "white"
                      : "#888888",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer"
                }}
                onClick={e => {
                  e.stopPropagation();
                  if (audioRecording.type === "DONE_RECORDING") {
                    saveRecording();
                  }
                }}
              >
                SAVE
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
              onClick={e => {
                e.stopPropagation();
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
            <div
              style={{
                position: "absolute",
                left: 15,
                bottom: 15,
                cursor: "pointer"
              }}
              onClick={e => {
                e.stopPropagation();
                if (m.translation && m.translation.audio) {
                  new Audio(m.translation.audio).play();
                } else {
                  openRecorder(m.id);
                }
              }}
            >
              <span role="img" aria-label="record-audio">
                🔊
              </span>
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

const mapState = state => state;

const mapDispatch = {
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
};

export default connect(mapState, mapDispatch)(App);
