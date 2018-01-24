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
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import MicIcon from "material-ui-icons/Mic";
import StopIcon from "material-ui-icons/Stop";

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
  message,
  recording,
  editText,
  editTranslation,
  startRecording,
  stopRecording,
  saveMessage,
  cancelEditingMessage
}) => (
  <div>
    <AppBar title="Editing Message" onBack={cancelEditingMessage} />
    <div
      style={{
        maxWidth: 680,
        margin: "80px auto",
        padding: "0 10px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <textarea
        value={message.text}
        onChange={e => {
          editText(e.target.value);
        }}
        placeholder="Enter text"
        style={{
          width: "100%",
          height: 70,
          fontSize: 20,
          marginBottom: 10,
          border: 0
        }}
      />
      {message.audio ? (
        <div
          style={{
            width: "100%",
            height: 50,
            fontSize: 15,
            marginBottom: 10,
            color: "white",
            backgroundColor: "#13c713",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            borderRadius: 100
          }}
          onClick={() => {
            new Audio(message.audio).play();
          }}
        >
          <PlayArrowIcon />
        </div>
      ) : null}
      <div
        style={{
          width: "100%",
          height: 50,
          fontSize: 15,
          marginBottom: 10,
          color: "white",
          backgroundColor:
            recording && !recording.isTranslation ? "#c71334" : "#13c713",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: 100
        }}
        onClick={async () => {
          if (recording && !recording.isTranslation) {
            const { audioUrl } = await recording.audioPromise();
            stopRecording(audioUrl);
          } else {
            const start = await recordAudio();
            startRecording({
              audioPromise: start(),
              isTranslation: false
            });
          }
        }}
      >
        {recording && !recording.isTranslation ? <StopIcon /> : <MicIcon />}
      </div>
      <textarea
        value={message.translation}
        onChange={e => {
          editTranslation(e.target.value);
        }}
        placeholder="Enter translation"
        style={{
          width: "100%",
          height: 70,
          fontSize: 20,
          marginBottom: 10,
          border: 0
        }}
      />
      {message.translationAudio ? (
        <div
          style={{
            width: "100%",
            height: 50,
            fontSize: 15,
            marginBottom: 10,
            color: "white",
            backgroundColor: "#13c713",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            borderRadius: 100
          }}
          onClick={() => {
            new Audio(message.translationAudio).play();
          }}
        >
          <PlayArrowIcon />
        </div>
      ) : null}
      <div
        style={{
          width: "100%",
          height: 50,
          fontSize: 15,
          marginBottom: 10,
          color: "white",
          backgroundColor:
            recording && recording.isTranslation ? "#c71334" : "#13c713",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: 100
        }}
        onClick={async () => {
          if (recording && recording.isTranslation) {
            const { audioUrl } = await recording.audioPromise();
            stopRecording(audioUrl);
          } else {
            const start = await recordAudio();
            startRecording({
              audioPromise: start(),
              isTranslation: true
            });
          }
        }}
      >
        {recording && recording.isTranslation ? <StopIcon /> : <MicIcon />}
      </div>
      <div
        style={{
          width: "100%",
          height: 50,
          color: "white",
          backgroundColor: "#13c713",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: 100
        }}
        onClick={saveMessage}
      >
        SAVE MESSAGE
      </div>
    </div>
  </div>
);

const mapState = ({ editing }) => ({
  message: editing && editing.message,
  recording: editing && editing.recording
});

const mapDispatch = {
  editText,
  editTranslation,
  startRecording,
  stopRecording,
  saveMessage,
  cancelEditingMessage
};

export default connect(mapState, mapDispatch)(MessageEdit);
