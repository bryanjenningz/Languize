import React from "react";
import { connect } from "react-redux";
import Chats from "./Chats";
import Chat from "./Chat";
import MessageEdit from "./MessageEdit";

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
      return (
        <div>
          Review
          {reviewCards.map(c => <div>{JSON.stringify(c)}</div>)}
        </div>
      );
    case "People":
      return <div>People</div>;
    case "Profile":
      return <div>Profile</div>;
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
