export const SET_LOANS = "SET_LOANS";

export const fetchLoans = () => {
  console.log('fetch loans -------------')
  return async (dispatch, getState) => {
    const response = await fetch("http://192.168.1.190:5000/api/loan/groupByFriends/" + getState().auth.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    dispatch({ type: SET_LOANS, loans: resData.loans});
  };
};
