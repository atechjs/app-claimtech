import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

class ToolbarPulsanteAggiungi extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Tooltip title="Nuovo">
          <IconButton onClick={this.props.onAddClick} component="label">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }
}

export default ToolbarPulsanteAggiungi;
