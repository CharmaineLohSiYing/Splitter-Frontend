import {
    SET_LOANS
  } from "../actions/loan";
  
  const initialState = {
    loans: {},
    netDebt: 0
  };
  
  export default (state = initialState, action) => {
  
    switch (action.type) {
      case SET_LOANS:
        return {
          ...state,
          loans: action.loans,
          netDebt: action.netDebt
        };
      
  
      default:
        return state;
    }
  };
  