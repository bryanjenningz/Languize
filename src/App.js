import React from "react";
import { connect } from "react-redux";
import Chat from "./Chat";
import MessageEdit from "./MessageEdit";

const App = ({ editing }) => {
  if (editing) {
    return <MessageEdit />;
  }
  return <Chat />;
};

export default connect(({ editing }) => ({ editing }))(App);
