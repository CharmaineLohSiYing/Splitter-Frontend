import {
  ADD_ATTENDEES,
  ADD_SHARED_ORDER,
  REMOVE_SHARED_ORDER,
  UPDATE_SHARED_ORDER,
  UPDATE_INDIVIDUAL_ORDER,
  UPDATE_PAID_AMOUNT,
  UPDATE_BILL_DETAILS,
  CREATE_BILL,
  EDIT_BILL,
  SET_USERBILLS,
  INITIALISE_BILL_DETAILS,
} from "../actions/bill";

const initialState = {
  attendees: {},
  sharedOrders: [],
  totalBill: 0,
  currentHighestSharedOrderId: 0,
  bills: [],
  userBills: [],
  billDetails: {},
  billId: null,
  unpaidAmount: 0
};

export default (state = initialState, action) => {
  const updateTotalBill = () => {
    var totalBill = 0;
    Object.keys(state.attendees).forEach((key) => {
      totalBill += parseFloat(state.attendees[key].amount);
    });
    state.sharedOrders.forEach(
      (order) => (totalBill += parseFloat(order.amount))
    );
    return totalBill;
  };

  const addToBill = (amount) => {
    return (state.totalBill += parseFloat(amount));
  };

  const updateUnpaidAmount = (updatedAttendees, netBill) => {
    console.log('update unpaid amount', netBill)
    var unpaidAmount = netBill
    Object.keys(updatedAttendees).forEach((key) => {
      unpaidAmount -= updatedAttendees[key].paidAmount
    });
    return unpaidAmount.toFixed(2)
  }

  let unpaidAmount; 
  
  switch (action.type) {
    case INITIALISE_BILL_DETAILS:
      return {
        ...state,
        currentHighestSharedOrderId: action.sharedOrderId,
        billDetails: action.billDetails,
        attendees: action.attendees,
        sharedOrders: action.sharedOrders,
        totalBill: action.totalBill,
        billId: action.billId 
      };
    case ADD_ATTENDEES:
      let originalAttendees = state.attendees;
      let attendees = action.attendees;
      let newSharedOrders = state.sharedOrders;

      // transfer amount from existing attendee
      Object.keys(attendees).forEach((key) => {
        if (
          key in originalAttendees &&
          originalAttendees[key].amount != NaN &&
          originalAttendees[key].amount != undefined
        ) {
          attendees[key].amount = originalAttendees[key].amount;
          attendees[key].paidAmount = originalAttendees[key].paidAmount;
        } else {
          attendees[key].amount = 0;
          attendees[key].paidAmount = 0;
        }
      });
      var updatedBill = state.totalBill;

      // check if any attendee from shared orders has been removed
      // and update total bill if removed attendee previously placed an order
      const sharedOrdersToRemove = []
      Object.keys(originalAttendees).forEach((key) => {
        
        if (!(key in attendees)) {
          newSharedOrders.forEach((sharedOrder) => {
            sharedOrder.users = sharedOrder.users.filter(
              (item) => item !== key
            );
            if (sharedOrder.users.length < 2) {
              sharedOrdersToRemove.push(sharedOrder.id)
            }
          });
          updatedBill = updateTotalBill();
        }
      });
      console.log(sharedOrdersToRemove)
      sharedOrdersToRemove.forEach(toRemoveId => {
        newSharedOrders = newSharedOrders.filter((obj) => obj.id !== toRemoveId)
      })
      console.log(newSharedOrders)

      return {
        ...state,
        attendees: attendees,
        sharedOrders: newSharedOrders,
        totalBill: updatedBill,
      };
    case ADD_SHARED_ORDER:
      const newHighestId = state.currentHighestSharedOrderId + 1;
      var totalBill = addToBill(action.amount);
      return {
        ...state,
        currentHighestSharedOrderId: newHighestId,
        sharedOrders: state.sharedOrders.concat({
          id: newHighestId,
          amount: action.amount,
          users: action.sharers,
        }),
        totalBill,
      };
    case UPDATE_BILL_DETAILS:
      console.log("update bill details in store");
      unpaidAmount = updateUnpaidAmount(state.attendees, action.billDetails.netBill)
      return {
        ...state,
        billDetails: action.billDetails,
        unpaidAmount
      };
    case REMOVE_SHARED_ORDER:
      const orderAmount = state.sharedOrders.find(
        (order) => order.id == action.orderId
      ).amount;
      var filteredOrders = state.sharedOrders.filter(
        (order) => order.id != action.orderId
      );

      

      var totalBill = addToBill(-1 * parseFloat(orderAmount));

      return {
        ...state,
        sharedOrders: filteredOrders,
        totalBill,
      };
    case UPDATE_INDIVIDUAL_ORDER:
      var user = state.attendees[action.userId];
      user.amount = action.amount;
      var totalBill = updateTotalBill();
      return {
        ...state,
        attendees: { ...state.attendees, [action.userId]: user },
        totalBill,
      };
    case UPDATE_PAID_AMOUNT:
      var user = state.attendees[action.userId];
      user.paidAmount = action.amount;
      var updatedAttendees =  { ...state.attendees, [action.userId]: user }
      unpaidAmount = updateUnpaidAmount(updatedAttendees, state.billDetails.netBill)
      return {
        ...state,
        unpaidAmount,
        attendees: updatedAttendees,
      };
    case UPDATE_SHARED_ORDER:

      // let targetIdx = state.sharedOrders.findIndex((obj) => {return obj.id == action.orderId})
      // let targetOrder = state.sharedOrders[targetIdx]
      // targetOrder.amount = action.amount
      // targetOrder.users = action.sharers
      let newArr = state.sharedOrders.map(el => el.id == action.orderId ? {...el, amount: action.amount, users: action.sharers} : el);
      var totalBill = updateTotalBill();
      return {
          ...state,
          sharedOrders: newArr,
          totalBill,
      };
      
      // var targetOrder = state.sharedOrders.filter(
      //   (order) => order.id == action.orderId
      // )[0];
      // targetOrder.amount = action.amount;
      // targetOrder.users = action.sharers;
      // var newArray = state.sharedOrders
      //   .filter((order) => order.id != action.orderId)
      //   .concat(targetOrder);
      // var totalBill = updateTotalBill();
      // return {
      //   ...state,
      //   sharedOrders: newArray,
      //   totalBill,
      // };

    case CREATE_BILL:
      console.log('reducer - create bill')
      var updatedUserBills = state.bills.concat(action.userBill);
      return {
        ...state,
        attendees: {},
        sharedOrders: [],
        totalBill: 0,
        currentHighestSharedOrderId: 0,
        userBills: updatedUserBills,
        billDetails: {},
        unpaidAmount: 0
      };
    case EDIT_BILL:
      const originalUserBill = state.userBills.find(userBill => userBill._id.toString() === action.userBill._id.toString());
      var i = state.userBills.indexOf(originalUserBill);
      state.userBills[i] = action.userBill;
      return {
        ...state,
        attendees: {},
        sharedOrders: [],
        totalBill: 0,
        currentHighestSharedOrderId: 0,
        userBills: state.userBills,
        billDetails: {},
        unpaidAmount: 0,
        billId: null
      };
    case SET_USERBILLS:
      return {
        ...state,
        userBills: action.userBills,
      };

    default:
      return state;
  }
};
