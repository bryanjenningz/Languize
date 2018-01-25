import React from "react";
import { connect } from "react-redux";
import AppBar from "./AppBar";
import { startEditingMessage, selectChatID, addReviewCard } from "./reducer";
import EditIcon from "material-ui-icons/Edit";
import VolumeUpIcon from "material-ui-icons/VolumeUp";
import AddCircleIcon from "material-ui-icons/AddCircle";

const randomId = () => String(Math.random()).slice(2);

const Chat = ({ messages, name, startEditingMessage, goBackToChats, addReviewCard }) => (
  <div>
    <AppBar title={name} onBack={goBackToChats} />
    <div
      style={{
        textAlign: "center",
        maxWidth: 700,
        margin: "0 auto",
        height: "100vh",
        padding: "55px 10px 10px 10px"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 9, overflow: "auto" }}>
          {messages.map((m, i) => {
            const isRight = i % 2 === 1;
            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: isRight ? "row-reverse" : "row"
                }}
              >
                <div
                  style={{
                    flex: 1,
                    top: 10,
                    left: 15,
                    cursor: "pointer"
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    startEditingMessage(m);
                  }}
                >
                  <EditIcon />
                </div>
                <div
                  style={{
                    flex: 4,
                    padding: 30,
                    margin: "20px 0",
                    backgroundColor: "white",
                    fontSize: 20,
                    position: "relative"
                  }}
                >
                  {m.audio ? (
                    <div
                      style={{
                        position: "absolute",
                        left: 15,
                        top: 15,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        new Audio(m.audio).play();
                      }}
                    >
                      <VolumeUpIcon />
                    </div>
                  ) : null}
                  {m.translationAudio ? (
                    <div
                      style={{
                        position: "absolute",
                        left: 15,
                        bottom: 15,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        new Audio(m.translationAudio).play();
                      }}
                    >
                      <VolumeUpIcon />
                    </div>
                  ) : null}
                  {m.text && m.translation ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        addReviewCard({ messageID: m.id, nextReviewTime: Date.now() });
                      }}
                    >
                      <AddCircleIcon />
                    </div>
                  ) : null}
                  {m.text}
                  {m.translation ? (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          borderTop: "1px solid #aaa",
                          marginTop: 10,
                          paddingTop: 10
                        }}
                      >
                        <div>{m.translation}</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            height: 50,
            marginTop: 10
          }}
        >
          <div
            onClick={() =>
              startEditingMessage({
                id: randomId(),
                text: "",
                audio: "",
                translation: "",
                translationAudio: ""
              })
            }
            style={{
              width: "100%",
              fontSize: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "#13c713",
              color: "white",
              borderRadius: 100
            }}
          >
            ADD MESSAGE
          </div>
        </div>
      </div>
    </div>
  </div>
);

const mapState = ({ chats, selectedChatID }) =>
  chats.find(chat => chat.id === selectedChatID) || {
    name: "Chat",
    messages: []
  };

const mapDispatch = {
  startEditingMessage,
  goBackToChats: selectChatID.bind(null, null),
  addReviewCard
};

export default connect(mapState, mapDispatch)(Chat);
