import * as actions from "./actionsType";

const initialData = {
    loading : false,
    saveLoading : false,
    tipoVentaLength : 0,
    tipoVentas : [],
    formError : "",
    tipoVentaError : "",
};

export default function TipoVentaReducer (state = initialData, action) {
    switch (action.type) {
        case actions.LOADING_TIPO_VENTA:
            return { ...state, loading: action.payload };
        case actions.SAVE_LOADING_VENTA:
            return { ...state, saveLoading : action.payload};
        case actions.GET_TIPO_VENTA:
            return { 
                ...state,
                tipoVentas : action.payload.tipoVentas,
                tipoVentaLength : action.payload.tipoVentaLength,
            };
        case actions.FORM_FAIL:
            return { ...state, formError: action.payload };

        case actions.TIPO_VENTA_FAIL:
            return { ...state, tipoVentaError : action.payload };
        default:
            return state;
    }
}