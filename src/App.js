import React from "react";
import { connect } from "react-redux";

const initialState = {
  text: "",
  messages: [],
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
        messages: state.messages.map(
          m =>
            m.id === action.note.messageId
              ? { ...m, notes: m.notes.concat(action.note) }
              : m
        )
      };
    case "EDIT_NOTE":
      return { ...state, editingNote: action.note };
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

const randomId = () => String(Math.random()).slice(2);

const App = ({ text, messages, changeText, addMessage }) => (
  <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
    <div
      style={{
        display: "flex",
        height: 50
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
          backgroundColor: "white",
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
    <div>{messages.map(m => <div key={m.id}>{m.text}</div>)}</div>
  </div>
);

const mapState = ({ text, messages }) => ({ text, messages });
const mapDispatch = { changeText, addMessage };

export default connect(mapState, mapDispatch)(App);
