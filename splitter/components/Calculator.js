import React from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableHighlightBase,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import CalculatorColumn from "./UI/CalculatorColumn";
import CalculatorButton from "./UI/CalculatorButton";
import * as billActions from "../store/actions/bill";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ProceedBottomButton from './UI/ProceedBottomButton'
import Colors from '../constants/Colors'

class Calculator extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      sharers: [],
      previousOperand: "",
      currentOperand: props.initialAmount,
      operation: "",
      previousOperandDisplay: "",
    };
  }

  updateValues = () => {
    this.props.getValuesFromCalculator(this.state.currentOperand, this.state.previousOperand, this.state.operation)
    this.updateDisplay();
  }



  pressDigitHandler = async (value) => {
    if (value === "." && this.state.currentOperand.includes(".")) {
      return;
    } else if (value === "0" && this.state.currentOperand === "") {
      return;
    } else if (this.state.currentOperand.toString() === "0" && value !== ".") {
      this.setState({
        currentOperand: value.toString(),
      }, () => {
        this.updateValues();
      });
      console.log('here', value.toString(), this.state.currentOperand)
    } else {
      this.setState({
        currentOperand: this.state.currentOperand.toString() + value.toString(),
      }, () => {
        this.updateValues();
      });
    }
    
  }

  pressEqualHandler = (value) => {
    this.compute();
    this.setState({ previousOperandDisplay: "" });
  };

  pressClearHandler = (value) => {
    this.setState({
      operation: "",
      previousOperandDisplay: "",
      currentOperand: "0",
      previousOperand: "",
    });
    this.props.getValuesFromCalculator(0)
  };

  pressDeleteHandler = (value) => {
    const length = this.state.currentOperand.toString().length;
    if (length > 0) {
      if (length === 1) {
        this.pressClearHandler();
      } else {
        let newValue = this.state.currentOperand.toString().slice(0, -1);
        this.setState({
          currentOperand: newValue
        });
        this.props.getValuesFromCalculator(newValue);
      }
    }
  };

  pressOperatorHandler = async (type) => {
    if (this.state.currentOperand === "") return;

    await this.compute();
    this.setState({
      operation: type,
      previousOperand: this.state.currentOperand,
      currentOperand: "",
    });
    this.updateDisplay();
  };

  getDisplayNumber = (number) => {
    return number;
  };

  updateDisplay = () => {
    // this.setState({
    //   currentOperand: this.getDisplayNumber(this.state.currentOperand),
    // });
    if (this.state.operation !== "") {
      let symbol = this.state.operation
      this.setState({
        previousOperandDisplay: this.state.previousOperand + " " + symbol
          // this.getDisplayNumber(this.state.previousOperand) + " " + symbol,
      });
    } else {
      //this.setState({previousOperandDisplay: this.getDisplayNumber(this.state.previousOperand)})
      this.setState({ previousOperandDisplay: "" });
    }
  };

  compute = async () => {
    let computation;
    const prev = parseFloat(this.state.previousOperand);
    const current = parseFloat(this.state.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.state.operation) {
      case "×":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "=":
        computation = prev - current;
        break;
      default:
        return;
    }
    await this.setState({
      operation: "",
      currentOperand: computation,
      previousOperand: "",
    });
    this.props.getValuesFromCalculator(computation)
  };

  componentDidMount(){
    this.setState({
      currentOperand: this.props.initialAmount
    })
  }

  // UNSAFE_componentWillMount() {
  //   const routeParams = this.props;
  //   let currentOrderAmount;
  //   let currentPaidAmount;
  //   if (routeParams) {
  //     if (routeParams.updateSharedOrder) {
  //       // currentOrderAmount = this.props.sharedOrders.filter(
  //       //   (order) => order.id === routeParams.orderId
  //       // )[0].amount;
  //       // this.setState({
  //       //   currentOperand: currentOrderAmount.toString(),
  //       //   orderIdToUpdate: routeParams.orderId,
  //       //   sharers: routeParams.sharers,
  //       // });
  //     } else if (routeParams.updateIndividualOrder) {

  //       currentOrderAmount = this.props.attendees[routeParams.userId].amount;
  //       this.setState({
  //         currentOperand: currentOrderAmount.toString(),
  //         attendeeIdToUpdate: routeParams.orderId,
  //         sharers: [this.props.attendees[routeParams.userId]],
  //       });
  //     } else if (routeParams.updatePaidAmount) {
  //       currentPaidAmount = this.props.attendees[routeParams.userId].paidAmount;
  //       var defaultValue = currentPaidAmount;
  //       if (currentPaidAmount == 0) {
  //         defaultValue = routeParams.unpaidAmount;
  //       }

  //       this.setState({
  //         currentOperand: defaultValue.toString(),
  //         attendeeIdToUpdate: routeParams.orderId,
  //         updatePaidAmount: true,
  //       });
  //     } else {
  //       // new shared order
  //       this.setState({
  //         combinedOrder: true,
  //         sharers: routeParams.sharers,
  //       });
  //     }
  //   }
  // }

  submitOrder = async () => {
    // console.log('=====================submit===============')
    await this.compute();

    const {
      addSharedOrder,
      updateIndividualOrder,
      updateSharedOrder,
      updatePaidAmount,
    } = this.props.actions;

    if (this.state.updatePaidAmount) {
      updatePaidAmount(
        this.props.userId,
        this.state.currentOperand
      );

      this.props.navigation.navigate("AddPayers");
      return;
    } else {
      const sharersArray = this.state.sharers;

      if (sharersArray.length > 1) {
        if (this.state.orderIdToUpdate) {
          updateSharedOrder(
            this.state.orderIdToUpdate,
            this.state.currentOperand,
            sharersArray
          );
        } else {
          addSharedOrder(this.state.currentOperand, sharersArray);
        }
      } else {
        updateIndividualOrder(
          this.props.userId,
          this.state.currentOperand
        );
      }
      this.props.navigation.navigate("AddOrders");
    }
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.aboveCalculator}>
          <View style={styles.calculatedValueContainer}>
            <Text style={styles.calculation}>
              {this.state.previousOperandDisplay}
            </Text>
          </View>
          <View style={styles.calculatedValueContainer}>
            <Text style={styles.calculation}>{this.state.currentOperand}</Text>
          </View>
            
        </View>

        <View style={styles.calculator}>
          <CalculatorColumn>
            <CalculatorButton value="Clear" onPress={this.pressClearHandler} />
            <CalculatorButton
              digit
              value="7"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              value="4"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              value="1"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              fontSize={20}
              value="%"
              onPress={this.pressOperatorHandler}
            />
          </CalculatorColumn>
          <CalculatorColumn>
            <CalculatorButton
              digit
              fontSize={20}
              value="÷"
              onPress={this.pressOperatorHandler}
            />
            <CalculatorButton
              digit
              value="8"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              value="5"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              value="2"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              value="0"
              onPress={this.pressDigitHandler}
            />
          </CalculatorColumn>
          <CalculatorColumn>
            <CalculatorButton
              digit
              fontSize={20}
              value="×"
              onPress={this.pressOperatorHandler}
            />
            <CalculatorButton
              digit
              value="9"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              value="6"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              value="3"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              digit
              fontSize={20}
              value="."
              onPress={this.pressDigitHandler}
            />
          </CalculatorColumn>
          <CalculatorColumn>
            <CalculatorButton
              value="Delete"
              onPress={this.pressDeleteHandler}
            />
            <CalculatorButton
              digit
              fontSize={20}
              value="-"
              onPress={this.pressOperatorHandler}
            />
            <CalculatorButton 
              digit
              fontSize={20} 
              value="+" 
              onPress={this.pressOperatorHandler} 
            />
            <CalculatorButton
              digit
              fontSize={20}
              style={{ flex: 2 }}
              value="="
              onPress={this.pressEqualHandler}
            />
          </CalculatorColumn>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth:1,
    borderColor:Colors.blue3,
  },
  calculator: {
    height: "80%",
    width: "100%",
    flexDirection: "row",
    backgroundColor:Colors.blue5,
  },
  delete: {
    backgroundColor: Colors.blue2,
    height: "12%",
    width: "25%",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  calculatedValue: {
    fontSize: 30,
  },
  calculatedValueContainer: {
    alignItems: "flex-end",
  },
  calculation: {
    fontSize: 20,
    color: Colors.blue1
  },
  aboveCalculator:{
    flex:1,
    paddingTop: 10,
    paddingRight: 10,
    justifyContent:'flex-end',
  },
});

const mapStateToProps = (state) => {
  const { sharedOrders, attendees } = state.bill;
  return { sharedOrders, attendees };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(billActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Calculator);
