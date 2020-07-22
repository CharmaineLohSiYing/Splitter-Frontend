import { AUTHENTICATE, LOG_OUT, SIGN_UP, VERIFY_OTP, SET_CONTACTS, SET_DID_TRY_AUTOLOGIN } from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  name: null, 
  mobileNumber: null,
  didTryAutoLogin: false,
  contacts: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      console.log('authenticate', action)
      return {
        token: action.token,
        userId: action.userId,
        name: action.name, 
        mobileNumber: action.mobileNumber,
        didTryAutoLogin: true
      };
    case LOG_OUT:
      return {token: null, userId: null, didTryAutoLogin: true};
    case SET_DID_TRY_AUTOLOGIN:
      return{
        ...state, 
        didTryAutoLogin: true
      }
    case SIGN_UP:
      return {
        ...state, 
        userId: action.userId
      };
    case SET_CONTACTS:
      return{
        ...state,
        contacts: action.contacts
      }
    default:
      return state;
  }
};
