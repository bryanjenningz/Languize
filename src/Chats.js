import React from "react";
import { connect } from "react-redux";
import { selectChatID } from "./reducer";
import AppBar from "./AppBar";

const Chats = ({ chats, selectChatID }) => (
  <div>
    <AppBar title="Chats" />
    <div
      style={{
        textAlign: "center",
        maxWidth: 700,
        margin: "0 auto",
        height: "100vh",
        padding: "55px 10px 10px 10px"
      }}
    >
      {chats.map(chat => (
        <div
          key={chat.id}
          style={{
            background: "white",
            padding: 30,
            margin: "20px 0",
            cursor: "pointer"
          }}
          onClick={() => selectChatID(chat.id)}
        >
          {chat.name}
        </div>
      ))}
    </div>
  </div>
);

const mapState = ({ chats }) => ({ chats });

const mapDispatch = { selectChatID };

export default connect(mapState, mapDispatch)(Chats);
