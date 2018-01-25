import React from "react";
import { connect } from "react-redux";
import Chats from "./Chats";
import Chat from "./Chat";
import MessageEdit from "./MessageEdit";

const App = ({ editing, selectedChatID }) => {
  if (editing) {
    return <MessageEdit />;
  } else if (selectedChatID) {
    return <Chat />;
  } else {
    return <Chats />;
  }
};

export default connect(({ editing, selectedChatID }) => ({
  editing,
  selectedChatID
}))(App);
