import React from "react";
import { connect } from "react-redux";
import BottomNavigation, {
  BottomNavigationAction
} from "material-ui/BottomNavigation";
import ChatBubbleIcon from "material-ui-icons/ChatBubble";
import RestoreIcon from "material-ui-icons/Restore";
import PeopleIcon from "material-ui-icons/People";
import PersonPinIcon from "material-ui-icons/PersonPin";
import { changeRoute } from "./reducer";

const LabelBottomNavigation = ({ route, changeRoute }) => (
  <BottomNavigation
    value={route}
    onChange={(_, route) => {
      changeRoute(route);
    }}
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0
    }}
  >
    <BottomNavigationAction
      label="Chats"
      value="Chats"
      icon={<ChatBubbleIcon />}
    />
    <BottomNavigationAction
      label="Review"
      value="Review"
      icon={<RestoreIcon />}
    />
    <BottomNavigationAction
      label="People"
      value="People"
      icon={<PeopleIcon />}
    />
    <BottomNavigationAction
      label="Profile"
      value="Profile"
      icon={<PersonPinIcon />}
    />
  </BottomNavigation>
);

const mapState = ({ route }) => ({ route });

const mapDispatch = { changeRoute };

export default connect(mapState, mapDispatch)(LabelBottomNavigation);
