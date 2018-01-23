import React from "react";
import { connect } from "react-redux";
import AppBar from "./AppBar";
import { changeText, addMessage, startEditingMessage } from "./reducer";

const randomId = () => String(Math.random()).slice(2);

const Chat = ({
  text,
  messages,
  editing,
  changeText,
  addMessage,
  startEditingMessage
}) => (
  <div>
    <AppBar title="Chat" />
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
                  ✎
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
                      <span role="img" aria-label="play text audio">
                        🔊
                      </span>
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
                      <span role="img" aria-label="play translation audio">
                        🔊
                      </span>
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
            onClick={() =>
              addMessage({
                id: randomId(),
                text,
                audio: "",
                translation: "",
                translationAudio: ""
              })
            }
            style={{
              width: "20%",
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
      </div>
    </div>
  </div>
);

const mapState = state => state;

const mapDispatch = {
  changeText,
  addMessage,
  startEditingMessage
};

export default connect(mapState, mapDispatch)(Chat);
