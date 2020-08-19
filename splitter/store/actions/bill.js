export const ADD_ATTENDEES = "ADD_ATTENDEES";
export const ADD_SHARED_ORDER = "ADD_SHARED_ORDER";
export const REMOVE_SHARED_ORDER = "REMOVE_SHARED_ORDER";
export const UPDATE_SHARED_ORDER = "UPDATE_SHARED_ORDER";
export const UPDATE_INDIVIDUAL_ORDER = "UPDATE_INDIVIDUAL_ORDER";
export const UPDATE_PAID_AMOUNT = "UPDATE_PAID_AMOUNT";
export const CREATE_BILL = "CREATE_BILL";
export const EDIT_BILL = "EDIT_BILL";
export const UPDATE_BILL_DETAILS = "UPDATE_BILL_DETAILS";
export const SET_USERBILLS = "SET_USERBILLS";
export const INITIALISE_BILL_DETAILS = "INITIALISE_BILL_DETAILS";

export const addAttendees = (attendees) => {
  // convert attendees arr to obj
  const attendeesObj = {}
  attendees.forEach((attendee) => {
    attendeesObj[attendee.mobileNumber] = {
      name: attendee.name,
      mobileNumber: attendee.mobileNumber
    }
  })
  return (dispatch, getState) => {
    const currUser = getState().auth;
    attendeesObj[currUser.userId] = {
      id: currUser.userId,
      name: 'Me',
      mobileNumber: currUser.user.mobileNumber.toString(),
      currentUser: true,
    };
    dispatch(test(attendeesObj));
  };
};

const test = (attendees) => {
  return { type: ADD_ATTENDEES, attendees };
};

export const addSharedOrder = (amount, sharers) => {
  amount = parseFloat(amount).toFixed(2).toString()
  return { type: ADD_SHARED_ORDER, amount, sharers };
};

export const removeSharedOrder = (orderId) => {
  return { type: REMOVE_SHARED_ORDER, orderId };
};

export const updateSharedOrder = (id, amount, sharers) => {
  return { type: UPDATE_SHARED_ORDER, orderId: id, amount, sharers };
};

export const updateIndividualOrder = (userId, amount) => {
  return { type: UPDATE_INDIVIDUAL_ORDER, amount, userId };
};

export const updatePaidAmount = (userId, amount) => {
  return { type: UPDATE_PAID_AMOUNT, amount, userId };
};

export const updateBillDetails = (
  billName,
  formattedDate,
  addGST,
  addServiceCharge,
  discountType,
  discountAmount,
  netBill
) => {
  const billDetails = {
    billName,
    formattedDate,
    addGST,
    addServiceCharge,
    discountType,
    discountAmount,
    netBill,
  };
  return {
    type: UPDATE_BILL_DETAILS,
    billDetails,
  };
};

export const createBill = () => {
  return async (dispatch, getState) => {
    const {
      billDetails,
      attendees,
      totalBill,
      sharedOrders,
    } = getState().bill;

    const response = await fetch("http://192.168.1.190:5000/bill/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        billDetails,
        attendees,
        totalBill,
        sharedOrders,
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
    console.log('add bill success')

    const resData = await response.json();
    dispatch({ type: CREATE_BILL, userBill: resData.userBill });
  };
};

export const editBill = () => {
  return async (dispatch, getState) => {
    const {
      billDetails,
      attendees,
      totalBill,
      sharedOrders,
      billId
    } = getState().bill;


    var currUserId = getState().auth.userId
    const response = await fetch("http://192.168.1.190:5000/bill/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        billDetails,
        attendees,
        totalBill,
        sharedOrders,
        updatedBy: currUserId,
        billId
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
    dispatch({ type: EDIT_BILL, userBill: resData.userBill });
  };
};


export const fetchUserBills = () => {
  console.log('fetch user bills')
  return async (dispatch, getState) => {
    const response = await fetch(
      "http://192.168.1.190:5000/bill/user/" + getState().auth.userId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      console.log("errorResData", errorResData);

      let message = "Something went wrong!";
      if (errorResData) {
        message = errorResData;
      }
      throw new Error(message);
    }
    const resData = await response.json()
    dispatch({ type: SET_USERBILLS, userBills: resData.userBills });
  };
};

export const retrieveForEdit = (billId, matchedContacts) => {
  console.log('retrieveForEdit')
  return async (dispatch, getState) => {
    const response = await fetch(
      "http://192.168.1.190:5000/bill/retrieveForEdit/" + billId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      console.log("errorResData", errorResData);

      let message = "Something went wrong!";
      if (errorResData) {
        message = errorResData;
      }
      throw new Error(message);
    }

    const resData = await response.json()
    var attendees = {}
    const userBills = resData.userBills
    for (var key of Object.keys(matchedContacts)){
      var userBill = userBills.filter(userBill => {
        return userBill.user._id ===key
      })[0]
      attendees[key] = {
        amount: userBill.individualOrderAmount,
        name: matchedContacts[key],
        paidAmount: userBill.amountPaid
      }
    }

    
    const {billName, date, createdAt, totalBill ,hasGST, hasServiceCharge, discountType, discountAmount, netBill, sharedOrders} = resData.bill 
    
    const billDetails = {
      bill: billName,
      formattedDate: date,
      addGST: hasGST,
      addServiceCharge: hasServiceCharge,
      discountType,
      discountAmount,
      netBill,
    };

    var sharedOrderId = 0;
    sharedOrders.forEach(sharedOrder => {
      sharedOrderId += 1
      sharedOrder.id = sharedOrderId
    })
    sharedOrderId += 1

    dispatch({ type: INITIALISE_BILL_DETAILS, sharedOrders, billDetails, attendees, totalBill, sharedOrderId, billId});
  };
}