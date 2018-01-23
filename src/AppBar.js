import React from "react";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import MoreVertIcon from "material-ui-icons/MoreVert";

const styles = {
  root: {
    width: "100%"
  },
  flex: {
    flex: 1,
    textAlign: "center"
  },
  leftButton: {
    marginLeft: -12,
    marginRight: 20
  },
  rightButton: {
    marginLeft: 20,
    marginRight: -12
  }
};

function ButtonAppBar(props) {
  const { classes, title = "", onBack = () => {} } = props;
  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <IconButton
            className={classes.leftButton}
            color="inherit"
            aria-label="Back"
            onClick={onBack}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography type="title" color="inherit" className={classes.flex}>
            {title}
          </Typography>
          <IconButton
            className={classes.rightButton}
            color="inherit"
            aria-label="Options"
          >
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(ButtonAppBar);
