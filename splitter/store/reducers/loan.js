import {
    SET_LOANS
  } from "../actions/loan";
  
  const initialState = {
    loans: {},
  };
  
  export default (state = initialState, action) => {
  
    switch (action.type) {
      case SET_LOANS:
        return {
          ...state,
          loans: action.loans,
        };
      
  
      default:
        return state;
    }
  };
  