import React from "react";
import { connect } from "react-redux";
import { selectChatID } from "./reducer";
import AppBar from "./AppBar";

const Chats = ({ chats, selectChatID }) => (
  <div>
    <AppBar title="Chats" />
    {chats.map(chat => (
      <div
        key={chat.id}
        style={{ marginTop: 80 }}
        onClick={() => selectChatID(chat.id)}
      >
        {chat.name}
      </div>
    ))}
  </div>
);

const mapState = ({ chats }) => ({ chats });

const mapDispatch = { selectChatID };

export default connect(mapState, mapDispatch)(Chats);
