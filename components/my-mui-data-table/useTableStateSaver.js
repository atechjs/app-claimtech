import { useSimpleReducer } from "@bitovi/use-simple-reducer";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export function useTableStateSaver() {
  const router = useRouter();
  const { query, isReady } = router;
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function setParam(paramList) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    paramList.forEach((element) => {
      current.set(element.key, element.value);
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  const [state, actions, queue, error] = useSimpleReducer(
    // initial state
    {
      page: 0,
      text: "",
      filterList: [],
      ordinamento: {},
    },
    // collection of reducer methods
    {
      async salvaFilterList(state, filterList) {
        return { ...state, filterList: filterList };
      },
      async salvaOrdinamento(state, ordinamento) {
        return { ...state, ordinamento: ordinamento };
      },
      async salvaText(state, text) {
        return { ...state, text: text };
      },
      async salvaPage(state, page) {
        return { ...state, page: page };
      },
      async salvaRigheSelezionate(state, selectedRows) {
        return { ...state, selectedRows: selectedRows };
      },
      async mantieni(state) {
        const paramList = [
          { key: "filterList", value: JSON.stringify(state.filterList) },
          { key: "text", value: state.text !== null ? state.text : "" },
          { key: "page", value: JSON.stringify(state.page) },
          { key: "ordinamento", value: JSON.stringify(state.ordinamento) },
        ];
        setParam(paramList);
        return state;
      },
      async resetFiltro(state, index) {
        const filterList = state.filterList;
        filterList[index] = null;
        return { ...state, filterList: filterList };
      },
      async createIntialState(state) {
        const filterList = query["filterList"]
          ? JSON.parse(query["filterList"])
          : [];
        const text = query["text"] ? query["text"] : "";
        const page = query["page"] ? Number(query["page"]) : 0;
        const ordinamento = query["ordinamento"]
          ? JSON.parse(query["ordinamento"])
          : {};

        const newState = {
          ...state,
          filterList: filterList,
          text: text,
          page: page,
          ordinamento: ordinamento,
        };
        return newState;
      },
    }
  );

  function salvaFilterList(filterList) {
    actions.salvaFilterList(filterList);
  }

  function salvaOrdinamento(ordinamento) {
    actions.salvaOrdinamento(ordinamento);
  }

  function salvaText(text) {
    actions.salvaText(text);
  }

  function salvaPagina(page) {
    actions.salvaPage(page);
  }

  function mantieni() {
    actions.mantieni();
  }

  function createIntialState() {
    actions.createIntialState();
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
    actions.resetFiltro(index);
  }

  function salvaRigheSelezionate(rowSelected) {
    actions.salvaRigheSelezionate(rowSelected);
  }

  const funzioni = {
    salvaFilterList,
    salvaOrdinamento,
    salvaText,
    salvaPagina,
    mantieni,
    ottieniFiltroDaStato,
    createIntialState,
    resetFiltro,
    salvaRigheSelezionate,
  };

  return [state, funzioni];
}
