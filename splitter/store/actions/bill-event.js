export const ADD_ATTENDEES = "ADD_ATTENDEES";
export const ADD_SHARED_ORDER = "ADD_SHARED_ORDER";
export const REMOVE_SHARED_ORDER = "REMOVE_SHARED_ORDER";
export const UPDATE_SHARED_ORDER = "UPDATE_SHARED_ORDER";
export const UPDATE_INDIVIDUAL_ORDER = "UPDATE_INDIVIDUAL_ORDER";
export const UPDATE_PAID_AMOUNT = "UPDATE_PAID_AMOUNT";
export const CREATE_EVENT = "CREATE_EVENT";
export const EDIT_EVENT = "EDIT_EVENT";
export const UPDATE_BILL_DETAILS = "UPDATE_BILL_DETAILS";
export const SET_USEREVENTS = "SET_USEREVENTS";
export const INITIALISE_EVENT_DETAILS = "INITIALISE_EVENT_DETAILS";

export const addAttendees = (attendees) => {

  return (dispatch, getState) => {
    const currUser = getState().auth;
    attendees[currUser.userId] = {
      id: currUser.userId,
      name: currUser.user.firstName,
      mobileNumber: currUser.user.mobileNumber,
      currentUser: true,
    };
    dispatch(test(attendees));
  };
};

const test = (attendees) => {
  return { type: ADD_ATTENDEES, attendees };
};

export const addSharedOrder = (amount, sharers) => {
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
  eventName,
  formattedDate,
  addGST,
  addServiceCharge,
  discountType,
  discountAmount,
  netBill
) => {
  const billDetails = {
    eventName,
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

export const createEvent = () => {
  return async (dispatch, getState) => {
    const {
      billDetails,
      attendees,
      totalBill,
      sharedOrders,
    } = getState().billEvent;

    const response = await fetch("http://192.168.1.190:5000/event/add", {
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
      console.log("errorResData", errorResData);

      let message = "Something went wrong!";
      if (errorResData) {
        message = errorResData;
      }
      throw new Error(message);
    }
    console.log('add event success')

    const resData = await response.json();
    dispatch({ type: CREATE_EVENT, userEvent: resData.userEvent });
  };
};

export const editEvent = () => {
  return async (dispatch, getState) => {
    const {
      billDetails,
      attendees,
      totalBill,
      sharedOrders,
      eventId
    } = getState().billEvent;


    var currUserId = getState().auth.userId
    const response = await fetch("http://192.168.1.190:5000/event/edit", {
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
        eventId
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
    dispatch({ type: EDIT_EVENT, userEvent: resData.userEvent });
  };
};


export const fetchUserEvents = () => {
  console.log('fetch user events')
  return async (dispatch, getState) => {
    const response = await fetch(
      "http://192.168.1.190:5000/event/user/" + getState().auth.userId,
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
    dispatch({ type: SET_USEREVENTS, userEvents: resData.userEvents });
  };
};

export const retrieveForEdit = (eventId, matchedContacts) => {
  console.log('retrieveForEdit')
  return async (dispatch, getState) => {
    const response = await fetch(
      "http://192.168.1.190:5000/event/retrieveForEdit/" + eventId,
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
    const userEvents = resData.userEvents
    for (var key of Object.keys(matchedContacts)){
      var userEvent = userEvents.filter(userEvent => {
        return userEvent.user._id ===key
      })[0]
      attendees[key] = {
        amount: userEvent.individualOrderAmount,
        name: matchedContacts[key],
        paidAmount: userEvent.amountPaid
      }
    }

    
    const {eventName, date, createdAt, totalBill ,hasGST, hasServiceCharge, discountType, discountAmount, netBill, sharedOrders} = resData.event 
    
    const billDetails = {
      event: eventName,
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

    dispatch({ type: INITIALISE_EVENT_DETAILS, sharedOrders, billDetails, attendees, totalBill, sharedOrderId, eventId});
  };
}