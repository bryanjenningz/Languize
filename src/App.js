import React from "react";
import { connect } from "react-redux";

export const initialState = {
  text: "",
  messages: [
    { id: "1", text: "Hello", notes: [] },
    { id: "2", text: "你好", notes: [] },
    {
      id: "3",
      text:
        "Hi, how are you doing? I'm doing pretty well. I'm glad we get to talk on this app. It's so cool!",
      notes: []
    },
    { id: "4", text: "不错，我也很高兴认识你！", notes: [] },
    {
      id: "5",
      text: "Your Chinese is soooooo gooood! How did you learn?",
      notes: []
    }
  ],
  editingNote: null
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "CHANGE_TEXT":
      return { ...state, text: action.text };
    case "ADD_MESSAGE":
      return {
        ...state,
        text: "",
        messages: state.messages.concat({ id: action.id, text: action.text })
      };
    case "ADD_NOTE":
      return {
        ...state,
        editingNote: null,
        messages: state.messages.map(
          m =>
            m.id === action.note.messageId
              ? { ...m, notes: m.notes.concat(action.note) }
              : m
        )
      };
    case "EDIT_NOTE":
      return { ...state, editingNote: action.note };
    case "CANCEL_NOTE":
      return { ...state, editingNote: null };
    default:
      return state;
  }
};

export const changeText = text => ({ type: "CHANGE_TEXT", text });
export const addMessage = (id, text) => ({ type: "ADD_MESSAGE", id, text });
export const addNote = ({
  id,
  messageId,
  text,
  translation,
  textAudio,
  translationAudio
}) => ({
  type: "ADD_NOTE",
  note: { id, messageId, text, translation, textAudio, translationAudio }
});
export const editNote = ({
  id,
  messageId,
  text,
  translation,
  textAudio,
  translationAudio
}) => ({
  type: "EDIT_NOTE",
  note: { id, messageId, text, translation, textAudio, translationAudio }
});
export const cancelNote = () => ({ type: "CANCEL_NOTE" });

const randomId = () => String(Math.random()).slice(2);

const App = ({
  text,
  messages,
  editingNote,
  changeText,
  addMessage,
  editNote,
  addNote,
  cancelNote
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
    {editingNote ? (
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
          onClick={cancelNote}
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
              width: 400,
              height: 270,
              backgroundColor: "#eee",
              paddingTop: 25,
              zIndex: 2
            }}
          >
            <textarea
              value={editingNote.text}
              onChange={e => editNote({ ...editingNote, text: e.target.value })}
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
              value={editingNote.translation}
              onChange={e =>
                editNote({ ...editingNote, translation: e.target.value })
              }
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
                  if (editingNote.translation.trim()) {
                    addNote(editingNote);
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
                onClick={cancelNote}
              >
                ✖
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
              left: i % 2 === 1 ? "20%" : 0,
              cursor: "pointer"
            }}
            onClick={() =>
              editNote({
                id: randomId(),
                messageId: m.id,
                text: m.text,
                translation: "",
                textAudio: "",
                translationAudio: ""
              })
            }
          >
            {m.text}
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
          onClick={() => addMessage(randomId(), text)}
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

const mapState = ({ text, messages, editingNote }) => ({
  text,
  messages,
  editingNote
});
const mapDispatch = { changeText, addMessage, editNote, addNote, cancelNote };

export default connect(mapState, mapDispatch)(App);
