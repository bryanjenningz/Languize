import React from "react";
import { connect } from "react-redux";

export const initialState = {
  text: ""
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "CHANGE_TEXT":
      return { ...state, text: action.text };
    default:
      return state;
  }
};

export const changeText = text => ({ type: "CHANGE_TEXT", text });

const App = ({ text, changeText }) => (
  <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
    <input
      placeholder="Enter text here"
      onChange={e => changeText(e.target.value)}
      value={text}
    />
  </div>
);

const mapState = ({ text }) => ({ text });
const mapDispatch = { changeText };

export default connect(mapState, mapDispatch)(App);
