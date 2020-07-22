import { AsyncStorage } from "react-native";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOG_OUT = "LOG_OUT";
export const SET_DID_TRY_AUTOLOGIN = "SET_DID_TRY_AUTOLOGIN";
export const SIGN_UP = "SIGN_UP";
export const VERIFY_OTP = "VERIFY_OTP";
export const SET_CONTACTS = "SET_CONTACTS";

export const setDidTryAutoLogin = () => {
  return { type: SET_DID_TRY_AUTOLOGIN };
};

export const authenticate = (userId, token, name, mobileNumber) => {
  return (dispatch) => {
    dispatch({ type: AUTHENTICATE, userId, token, name, mobileNumber });
  };
};

export const setContacts = (contacts) => {
  return (dispatch) => {
    dispatch({ type: SET_CONTACTS, contacts });
  };
};



export const signup = (firstName, lastName, email, password, mobileNumber) => {
  return async (dispatch) => {
    const response = await fetch("http://192.168.1.190:5000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        mobileNumber,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      console.log("errorResData", errorResData);
     
      let message = "Something went wrong!";
      if (errorResData) {
        message = errorResData;
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch({ type: SIGN_UP, userId: resData.userId });
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch("http://192.168.1.190:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
    
      let message = "Something went wrong!";
      if (errorResData === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorResData === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }


    const resData = await response.json();

    if (resData.accessToken === 'NOT_VERIFIED'){
      dispatch(authenticate(resData.userId, null));
      throw new Error('NOT_VERIFIED');
    }
    dispatch(authenticate(resData.userId, resData.accessToken, resData.name, resData.mobileNumber));
    saveDataToStorage(resData.accessToken, resData.userId, resData.name, resData.mobileNumber);
  };
};

export const verifyOTP = (otp, userId) => {
  return async (dispatch) => {
    const response = await fetch("http://192.168.1.190:5000/auth/verifyotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        otp,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
     
      let message = "Something went wrong!";
      if (errorResData) {
        message = errorResData;
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(authenticate(userId, resData.accessToken, resData.name, resData.mobileNumber));
    saveDataToStorage(resData.accessToken, resData.userId, resData.name, resData.mobileNumber);
  };
};

export const logout = () => {
  AsyncStorage.removeItem("userData");
  return { type: LOG_OUT };
};

const saveDataToStorage = (token, userId, name, mobileNumber) => {
  console.log('savedatatostorage', name, mobileNumber, token, userId)
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      name,
      mobileNumber,
      token,
      userId,
    })
  );
};
