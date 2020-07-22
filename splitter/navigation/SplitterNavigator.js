import React from "react";
import { useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Platform, SafeAreaView, Button, View } from "react-native";
import LoginScreen from "../screens/user/LoginScreen";
import RegisterScreen from "../screens/user/RegisterScreen";
import OTPScreen from "../screens/user/OTPScreen";
import VerifyMobileNumberScreen from "../screens/user/VerifyMobileNumberScreen";

import ViewEventScreen from "../screens/bill-event/ViewEventScreen";
import EventsScreen from "../screens/bill-event/EventsScreen";

import AddAttendeesScreen from "../screens/bill-event/create/AddAttendeesScreen";
import AddOrdersScreen from "../screens/bill-event/create/AddOrdersScreen";
import SelectSharersScreen from "../screens/bill-event/create/SelectSharersScreen";
import AddPayersScreen from "../screens/bill-event/create/AddPayersScreen";
import CalculatorScreen from "../screens/bill-event/create/CalculatorScreen";

import LoansScreen from "../screens/loan/LoansScreen";
import ViewContactLoansScreen from "../screens/loan/ViewContactLoansScreen";
import CreateTransactionScreen from "../screens/loan/CreateTransactionScreen";
import CreateLoanScreen from "../screens/loan/CreateLoanScreen";

import SettingsScreen from '../screens/user/account/SettingsScreen'
import UpdateEmailScreen from '../screens/user/account/UpdateEmailScreen'
import UpdateMobileNumberScreen from '../screens/user/account/UpdateMobileNumberScreen'
import UpdatePasswordScreen from '../screens/user/account/UpdatePasswordScreen'
import UpdateDetailsScreen from '../screens/user/account/UpdateDetailsScreen'
import AccountOTPScreen from '../screens/user/account/AccountOTPScreen'



const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
      <AuthStackNavigator.Screen name="Register" component={RegisterScreen} />
      <AuthStackNavigator.Screen
        name="Verify"
        component={VerifyMobileNumberScreen}
      />
      <AuthStackNavigator.Screen name="OTP" component={OTPScreen} />
    </AuthStackNavigator.Navigator>
  );
};

const EventsStackNavigator = createStackNavigator();

export const EventsNavigator = () => {
  return (
    <EventsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <EventsStackNavigator.Screen name="Events" component={EventsScreen} />
      <EventsStackNavigator.Screen
        name="ViewEvent"
        component={ViewEventScreen}
      />
      <EventsStackNavigator.Screen
        name="AddAttendees"
        component={AddAttendeesScreen}
      />
      <EventsStackNavigator.Screen
        name="AddOrders"
        component={AddOrdersScreen}
      />
      <EventsStackNavigator.Screen
        name="SelectSharers"
        component={SelectSharersScreen}
      />
      <EventsStackNavigator.Screen
        name="Calculator"
        component={CalculatorScreen}
      />
      <EventsStackNavigator.Screen
        name="AddPayers"
        component={AddPayersScreen}
      />
    </EventsStackNavigator.Navigator>
  );
};

const LoansStackNavigator = createStackNavigator();

export const LoansNavigator = () => {
  return (
    <LoansStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <LoansStackNavigator.Screen name="Loans" component={LoansScreen} />
      <LoansStackNavigator.Screen
        name="ViewContactLoans"
        component={ViewContactLoansScreen}
      />
      <LoansStackNavigator.Screen
        name="CreateTransaction"
        component={CreateTransactionScreen}
      />
      <LoansStackNavigator.Screen
        name="CreateLoan"
        component={CreateLoanScreen}
      />
    </LoansStackNavigator.Navigator>
  );
};

const AccountStackNavigator = createStackNavigator();

export const AccountNavigator = () => {
  return (
    <AccountStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AccountStackNavigator.Screen name="Settings" component={SettingsScreen} />
      <AccountStackNavigator.Screen
        name="UpdateEmail"
        component={UpdateEmailScreen}
      />
      <AccountStackNavigator.Screen
        name="UpdateMobileNumber"
        component={UpdateMobileNumberScreen}
      />
      <AccountStackNavigator.Screen
        name="UpdatePassword"
        component={UpdatePasswordScreen}
      />
      <AccountStackNavigator.Screen
        name="UpdateDetails"
        component={UpdateDetailsScreen}
      />
      <AccountStackNavigator.Screen
        name="AccountOTP"
        component={AccountOTPScreen}
      />
    </AccountStackNavigator.Navigator>
  );
};

const SplitterDrawerNavigator = createDrawerNavigator();

export const SplitterNavigator = () => {
  // this dispatch line was brought out from drawerContent
  const dispatch = useDispatch();

  return (
    <SplitterDrawerNavigator.Navigator
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <DrawerItemList {...props} />
              <Button
                title="Logout"
                color={Colors.primary}
                onPress={() => {
                  dispatch(authActions.logout());
                  // props.navigation.navigate('Auth');
                }}
              />
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary,
      }}
    >
      <SplitterDrawerNavigator.Screen
        name="Loans"
        component={LoansNavigator}
        screenOptions={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-list" : "ios-list"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      <SplitterDrawerNavigator.Screen
        name="Events"
        component={EventsNavigator}
        screenOptions={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      <SplitterDrawerNavigator.Screen
        name="Account"
        component={AccountNavigator}
        screenOptions={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
    </SplitterDrawerNavigator.Navigator>
  );
};
