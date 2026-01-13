import * as actions from "./actionsType";

const initialData = {
    loading : false,
    datosBuscador : [],
    datoBuscador : {},
    buscadorError : "",
};

export default function BuscadorSerieReducer(state = initialData, action) {
    switch (action.type) {
        case actions.LOADING_BUSCADOR:
            return {...state, loading : action.payload};
        case actions.GET_BUSCADOR:
            return {...state, datosBuscador : action.payload};
        case actions.BUSCADOR_FAIL:
            return {...state, buscadorError : action.payload};
        default:
            return state;
    }
}