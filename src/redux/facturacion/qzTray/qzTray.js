import * as actions from "./actionsType";

const initialData = {
  loadingCertificate: false,
  certificate: null,
  signature: null,
  qzError: "",
};

export default function QZReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_QZ_CERTIFICATE:
      return { ...state, loadingCertificate: action.payload };

    case actions.SAVE_QZ_CERTIFICATE:
      return {
        ...state,
        certificate: action.payload.certificate,
        signature: action.payload.signature,
      };

    case actions.QZ_CERTIFICATE_FAIL:
      return { ...state, qzError: action.payload };

    default:
      return state;
  }
}
