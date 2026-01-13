import * as actions from "./actionsType";

const initialData = {
  loadingRecargaSummary: false,
 
  recargaSummary: {},
 
  recargaSummaryError: "",
  
};

export default function RecargasSummaryReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_RECARGA_SUMMARY:
      return { ...state, loadingRecargaSummary: action.payload };


    case actions.GET_RECARGA_SUMMARY:
      return {
        ...state,
        recargaSummary: action.payload,
      
      };

   

    case actions.RECARGA_SUMMARY_FAIL:
      return { ...state, recargaSummaryError: action.payload };

   
      
   
      
    default:
      return state;
  }
}
