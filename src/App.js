import React from "react";
import { connect } from "react-redux";
import Chats from "./Chats";
import Chat from "./Chat";
import MessageEdit from "./MessageEdit";
import Review from "./Review";
import People from "./People";
import Profile from "./Profile";

const App = ({ editing, selectedChatID, route, reviewCards }) => {
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
      return <Review />;
    case "People":
      return <People />;
    case "Profile":
      return <Profile />;
    default:
      throw new Error(`Invalid route: ${route}`);
  }
};

export default connect(({ editing, selectedChatID, route, reviewCards }) => ({
  editing,
  selectedChatID,
  route,
  reviewCards
}))(App);
