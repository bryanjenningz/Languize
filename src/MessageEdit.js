import React from "react";
import { connect } from "react-redux";
import AppBar from "./AppBar";
import {
  editText,
  editTranslation,
  startRecording,
  stopRecording,
  saveMessage,
  cancelEditingMessage
} from "./reducer";

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

const MessageEdit = ({
  editing,
  editText,
  editTranslation,
  startRecording,
  stopRecording,
  saveMessage,
  cancelEditingMessage
}) => (
  <div>
    <AppBar
      title={editing ? `Editing: ${editing.message.text}` : ""}
      onBack={cancelEditingMessage}
    />
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
  </div>
);

const mapState = ({ editing }) => ({ editing });

const mapDispatch = {
  editText,
  editTranslation,
  startRecording,
  stopRecording,
  saveMessage,
  cancelEditingMessage
};

export default connect(mapState, mapDispatch)(MessageEdit);
