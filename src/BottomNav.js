import React from "react";
import { connect } from "react-redux";
import BottomNavigation, {
  BottomNavigationAction
} from "material-ui/BottomNavigation";
import RestoreIcon from "material-ui-icons/Restore";
import FavoriteIcon from "material-ui-icons/Favorite";
import LocationOnIcon from "material-ui-icons/LocationOn";
import FolderIcon from "material-ui-icons/Folder";
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
      icon={<RestoreIcon />}
    />
    <BottomNavigationAction
      label="Study"
      value="Study"
      icon={<FavoriteIcon />}
    />
    <BottomNavigationAction
      label="People"
      value="People"
      icon={<LocationOnIcon />}
    />
    <BottomNavigationAction
      label="Profile"
      value="Profile"
      icon={<FolderIcon />}
    />
  </BottomNavigation>
);

const mapState = ({ route }) => ({ route });

const mapDispatch = { changeRoute };

export default connect(mapState, mapDispatch)(LabelBottomNavigation);
