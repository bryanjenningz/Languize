import React from "react";
import { connect } from "react-redux";
import { startReviewing } from "./reducer";

const Review = ({ reviewCards, reviewing, startReviewing }) =>
  reviewing ? (
    <div>
      {reviewCards[0].audio ? (
        <span onClick={() => new Audio(reviewCards[0].audio).play()} />
      ) : null}
      {reviewCards[0].text}
      <button>SHOW ANSWER</button>
    </div>
  ) : (
    <div>
      <button onClick={startReviewing}>START REVIEWING</button>
    </div>
  );

const mapState = ({ reviewCards, reviewing }) => ({
  reviewCards,
  reviewing
});

const mapDispatch = {
  startReviewing
};

export default connect(mapState, mapDispatch)(Review);
