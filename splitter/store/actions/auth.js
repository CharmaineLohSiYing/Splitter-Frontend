import { AsyncStorage } from "react-native";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOG_OUT = "LOG_OUT";
export const SET_DID_TRY_AUTOLOGIN = "SET_DID_TRY_AUTOLOGIN";
export const SIGN_UP = "SIGN_UP";
export const VERIFY_OTP = "VERIFY_OTP";
export const SET_CONTACTS = "SET_CONTACTS";
export const UPDATE_USER_ACCOUNT = "UPDATE_USER_ACCOUNT"


export const setDidTryAutoLogin = () => {
  return { type: SET_DID_TRY_AUTOLOGIN };
};

export const authenticate = (userId, token, user) => {
  return (dispatch) => {
    dispatch({ type: AUTHENTICATE, userId, token, user});
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
      // console.log("errorResData", errorResData);
     
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
  const email1 = email
  return async (dispatch) => {
    const response = await fetch("http://192.168.1.190:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email1
        
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

    const {userId, firstName, lastName, email, mobileNumber, accessToken} = resData
    const user = {
      firstName,
      lastName,
      email,
      mobileNumber
    }
    dispatch(authenticate(userId, accessToken, user));
    saveDataToStorage(accessToken, userId, firstName, lastName, mobileNumber, email);
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
    const {userId, firstName, lastName, email, mobileNumber, accessToken} = resData
    const user = {
      firstName,
      lastName,
      email,
      mobileNumber
    }
    dispatch(authenticate(userId, accessToken, user));
    saveDataToStorage(accessToken, userId, firstName, lastName, mobileNumber, email);
  };
};
export const updateDetails = (inputFirstName, inputLastName) => {
  return async (dispatch, getState) => {
    const response = await fetch(
      "http://192.168.1.190:5000/user/name/" + getState().auth.userId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: inputFirstName,
          lastName: inputLastName,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
     
      let message = "Something went wrong!";
      if (errorResData) {
        message = errorResData;
      }
      throw new Error(message);
    }

    const originalUser = getState().auth.user;
    const modifiedUser = {...originalUser, firstName: inputFirstName, lastName: inputLastName}
    dispatch({ type: UPDATE_USER_ACCOUNT, user: modifiedUser });
  };
};
export const updateEmail = (email) => {
  return async (dispatch, getState) => {
    const response = await fetch(
      "http://192.168.1.190:5000/user/email/" + getState().auth.userId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
     
      let message = "Something went wrong!";
      if (errorResData) {
        message = errorResData;
      }
      throw new Error(message);
    }

    const originalUser = getState().auth.user;
    const modifiedUser = {...originalUser, email}
    dispatch({ type: UPDATE_USER_ACCOUNT, user: modifiedUser });
  };
};
export const updateMobileNumber = (inputOTP) => {
  return async (dispatch, getState) => {
    const response = await fetch("http://192.168.1.190:5000/auth/verifyotp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: getState().auth.userId,
            otp: inputOTP,
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
    
    const {mobileNumber} = await response.json();

    const originalUser = getState().auth.user;
    const modifiedUser = {...originalUser, mobileNumber}
    dispatch({ type: UPDATE_USER_ACCOUNT, user: modifiedUser });
  };
};

export const logout = () => {
  AsyncStorage.removeItem("userData");
  return { type: LOG_OUT };
};

const saveDataToStorage = (token, userId, firstName, lastName, mobileNumber, email) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      firstName,
      lastName,
      token,
      userId,
      mobileNumber,
      email
    })
  );
};
