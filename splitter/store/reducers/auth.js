import { AUTHENTICATE, LOG_OUT, SIGN_UP, VERIFY_OTP, SET_CONTACTS, SET_DID_TRY_AUTOLOGIN, UPDATE_USER_ACCOUNT } from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  contacts: {},
  user: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      console.log('reducer-authenticate')
      return {
        token: action.token,
        userId: action.userId,
        user: action.user,
        didTryAutoLogin: true,
        accessTokenExpiration: action.accessTokenExpiration
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
      console.log('reducer - set contacts')
      return{
        ...state,
        contacts: action.contacts
      }
    case UPDATE_USER_ACCOUNT:
      return {
        ...state,
        user: action.user
      }
    default:
      return state;
  }
};
