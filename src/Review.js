import React from "react";
import { connect } from "react-redux";
import { startReviewing } from "./reducer";
import AppBar from "./AppBar";
import BottomNav from "./BottomNav";

const Review = ({
  reviewCards,
  reviewing,
  canStartReviewing,
  startReviewing
}) => (
  <div>
    <AppBar title="Review" />
    <div
      style={{
        textAlign: "center",
        maxWidth: 700,
        margin: "0 auto",
        height: "100vh",
        padding: "60px 10px 10px 10px"
      }}
    >
      {reviewing ? (
        <div>
          {reviewCards[0].audio ? (
            <span onClick={() => new Audio(reviewCards[0].audio).play()} />
          ) : null}
          {reviewCards[0].text}
          <button>SHOW ANSWER</button>
        </div>
      ) : (
        <div>
          <div
            onClick={() => {
              if (canStartReviewing) {
                startReviewing();
              }
            }}
            style={{
              marginTop: 20,
              width: "100%",
              height: 50,
              fontSize: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: canStartReviewing ? "#13c713" : "#ccc",
              color: canStartReviewing ? "white" : "#888",
              borderRadius: 100
            }}
          >
            START REVIEWING
          </div>
        </div>
      )}
    </div>
    <BottomNav />
  </div>
);

const mapState = ({ reviewCards, reviewing }) => ({
  reviewCards,
  reviewing,
  canStartReviewing: reviewCards.length > 0
});

const mapDispatch = {
  startReviewing
};

export default connect(mapState, mapDispatch)(Review);
