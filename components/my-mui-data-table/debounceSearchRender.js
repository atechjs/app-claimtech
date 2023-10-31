import React from "react";
import Grow from "@mui/material/Grow";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { withStyles } from "tss-react/mui";

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const defaultStyles = (theme) => ({
  main: {
    display: "flex",
    flex: "1 0 auto",
    alignItems: "center",
  },
  searchIcon: {
    color: theme.palette.text.secondary,
    marginRight: "8px",
  },
  searchText: {
    flex: "0.8 0",
  },
  clearIcon: {
    "&:hover": {
      color: theme.palette.error.main,
    },
  },
});

class _DebounceTableSearch extends React.Component {
  handleTextChangeWrapper = (debouncedSearch) => {
    return function (event) {
      debouncedSearch(event.target.value);
    };
  };

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown, false);
  }

  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.props.onHide();
    }
  };

  render() {
    const { classes, options, searchText, debounceWait, label, icon } =
      this.props;

    const debouncedSearch = debounce((value) => {
      this.props.onSearch(value);
    }, debounceWait);

    //const clearIconVisibility = options.searchAlwaysOpen ? "hidden" : "visible";

    return (
      <Grow appear in={true} timeout={300}>
        <div className={classes.main}>
          <TextField
            id={label}
            label={label}
            variant={"outlined"}
            type="search"
            className={classes.searchText}
            autoFocus={true}
            InputProps={{
              "data-test-id": options.textLabels.toolbar.search,
              "aria-label": options.textLabels.toolbar.search,
              startAdornment: (
                <InputAdornment position="start">{icon}</InputAdornment>
              ),
            }}
            defaultValue={searchText}
            onChange={this.handleTextChangeWrapper(debouncedSearch)}
            fullWidth={true}
            margin={"normal"}
            size={"small"}
            autoComplete="off"
            inputRef={(el) => (this.searchField = el)}
            placeholder={options.searchPlaceholder}
            {...(options.searchProps ? options.searchProps : {})}
          />
        </div>
      </Grow>
    );
  }
}

var DebounceTableSearch = withStyles(_DebounceTableSearch, defaultStyles, {
  name: "MUIDataTableSearch",
});
export { DebounceTableSearch };

export function debounceSearchRender(debounceWait = 200, label, icon) {
  return (searchText, handleSearch, hideSearch, options) => {
    return (
      <DebounceTableSearch
        searchText={searchText}
        onSearch={handleSearch}
        onHide={hideSearch}
        options={options}
        debounceWait={debounceWait}
        label={label}
        icon={icon}
      />
    );
  };
}
