import { useReducer, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export function useTableStateSaverV2() {
  const [state, dispatch] = useReducer(reducer, {
    page: 0,
    text: "",
    filterList: [],
    ordinamento: {},
  });

  function setParam(paramList) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    paramList.forEach((element) => {
      current.set(element.key, element.value);
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  function reducer(state, action) {
    switch (action.type) {
      case "salvaFilterList": {
        return { ...state, filterList: action.filterList };
      }
      case "salvaText": {
        return { ...state, text: action.text };
      }
      case "salvaOrdinamento": {
        return { ...state, ordinamento: action.ordinamento };
      }
      case "salvaPagina": {
        return { ...state, page: action.page };
      }
      case "createInitialState": {
        const filterList = action.query["filterList"]
          ? JSON.parse(action.query["filterList"])
          : [];
        const text = action.query["text"] ? action.query["text"] : "";
        const page = action.query["page"] ? Number(action.query["page"]) : 0;
        const ordinamento = action.query["ordinamento"]
          ? JSON.parse(action.query["ordinamento"])
          : {};

        const newState = {
          ...state,
          filterList: filterList,
          text: text,
          page: page,
          ordinamento: ordinamento,
        };
        return newState;
      }
      case "resetFiltro": {
        const filterList = state.filterList;
        filterList[action.index] = null;
        return { ...state, filterList: filterList };
      }
    }
    throw Error("Unknown action: " + action.type);
  }

  function salvaFilterList(filterList) {
    dispatch({ type: "salvaFilterList", filterList: filterList });
  }

  function salvaOrdinamento(ordinamento) {}

  function salvaText(text) {
    dispatch({ type: "salvaText", text: text });
  }

  function salvaPagina(page) {
    dispatch({ type: "salvaPagina", page: page });
  }

  function createIntialState(router, searchParams, pathname) {
    const { query } = router;
    dispatch({ type: "createInitialState", query: query });
  }

  function ottieniFiltroDaStato(index) {
    return state
      ? state.filterList
        ? state.filterList[index]
          ? state.filterList[index].length
            ? state.filterList[index]
            : null
          : null
        : null
      : null;
  }

  function resetFiltro(index) {
    dispatch({ type: "resetFiltro", index: index });
  }

  const funzioni = {
    salvaFilterList,
    salvaOrdinamento,
    salvaText,
    salvaPagina,
    ottieniFiltroDaStato,
    createIntialState,
    resetFiltro,
  };

  return [state, funzioni];
}
