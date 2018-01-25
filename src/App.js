import React from "react";
import { connect } from "react-redux";
import Chats from "./Chats";
import Chat from "./Chat";
import MessageEdit from "./MessageEdit";

const App = ({ editing, selectedChatID, route }) => {
  switch (route) {
    case "Chats":
      if (editing) {
        return <MessageEdit />;
      } else if (selectedChatID) {
        return <Chat />;
      } else {
        return <Chats />;
      }
    case "Review":
      return <div>Review</div>;
    case "People":
      return <div>People</div>;
    case "Profile":
      return <div>Profile</div>;
    default:
      throw new Error(`Invalid route: ${route}`);
  }
};

export default connect(({ editing, selectedChatID, route }) => ({
  editing,
  selectedChatID,
  route
}))(App);
