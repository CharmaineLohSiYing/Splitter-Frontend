import React from "react";
import { useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Platform, SafeAreaView, Button, View, StyleSheet } from "react-native";
import {
  Item,
  HeaderButtons,
  HeaderButton,
} from "react-navigation-header-buttons";
import LoginScreen from "../screens/user/LoginScreen";
import RegisterScreen from "../screens/user/RegisterScreen";
import OTPScreen from "../screens/user/OTPScreen";
import VerifyMobileNumberScreen from "../screens/user/VerifyMobileNumberScreen";

import ViewBillScreen from "../screens/bill/ViewBillScreen";
import BillsScreen from "../screens/bill/BillsScreen";

import AddAttendeesScreen from "../screens/bill/create/AddAttendeesScreen";
import AddOrdersScreen from "../screens/bill/create/AddOrdersScreen";
import SelectSharersScreen from "../screens/bill/create/SelectSharersScreen";
import AddPayersScreen from "../screens/bill/create/AddPayersScreen";
import CalculatorScreen from "../screens/bill/create/CalculatorScreen";
import EnterBillDetailsScreen from "../screens/bill/create/EnterBillDetailsScreen";
import TestScreen from "../screens/bill/create/TestScreen";

import LoansScreen from "../screens/loan/LoansScreen";
import ViewContactLoansScreen from "../screens/loan/ViewContactLoansScreen";
import ContactsListScreen from "../screens/loan/ContactsListScreen";


import SettingsScreen from "../screens/user/account/SettingsScreen";
import UpdateEmailScreen from "../screens/user/account/UpdateEmailScreen";
import UpdateMobileNumberScreen from "../screens/user/account/UpdateMobileNumberScreen";
import UpdatePasswordScreen from "../screens/user/account/UpdatePasswordScreen";
import UpdateDetailsScreen from "../screens/user/account/UpdateDetailsScreen";
import AccountOTPScreen from "../screens/user/account/AccountOTPScreen";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CustomHeaderButton from "../components/UI/CustomHeaderButton";

const toggleHeaderButton = (navigation) => {
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        iconName="md-menu"
        onPress={navigation.toggleDrawer}
        color="white"
        iconSize={28}
        IconComponent={Ionicons}
      />
    </HeaderButtons>
  );
};

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.blue : "",
  },
  headerTitleContainerStyle: {
    left: 0, // THIS RIGHT HERE
    right: 0,
  },
  headerTitleStyle: {
    fontFamily: "roboto-regular",
    flex: 1,
    alignSelf: "center",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Colors.lightGray,
  headerTitle: "SPLITTER",
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = ({ navigation }) => {
  return (
    <AuthStackNavigator.Navigator screenOptions={{ headerShown: false }}>
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

const BillsStackNavigator = createStackNavigator();

export const BillsNavigator = ({ navigation }) => {
  return (
    <BillsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <BillsStackNavigator.Screen
        name="Bills"
        component={BillsScreen}
      />
      <BillsStackNavigator.Screen
        name="ViewBill"
        component={ViewBillScreen}
      />
      <BillsStackNavigator.Screen
        name="AddAttendees"
        component={AddAttendeesScreen}
        options={{
          headerTitle: "New Bill"
        }}
      />
      <BillsStackNavigator.Screen
        name="AddOrders"
        component={AddOrdersScreen}
        options={{
          headerTitle: "New Bill",
        }}
      />
      <BillsStackNavigator.Screen
        name="BillDetails"
        component={EnterBillDetailsScreen}
        options={{
          headerTitle: "New Bill"
        }}
      />
      <BillsStackNavigator.Screen
        name="SelectSharers"
        component={SelectSharersScreen}
        options={{
          headerTitle: "New Bill"
        }}
      />
      <BillsStackNavigator.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          headerTitle: "New Bill"
        }}
      />
      <BillsStackNavigator.Screen
        name="AddPayers"
        component={AddPayersScreen}
        options={{
          headerTitle: "New Bill"
        }}
      />
      <BillsStackNavigator.Screen name="Test" component={TestScreen} />
    </BillsStackNavigator.Navigator>
  );
};

const LoansStackNavigator = createStackNavigator();

export const LoansNavigator = ({ navigation }) => {
  return (
    <LoansStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <LoansStackNavigator.Screen
        name="Loans"
        component={LoansScreen}
      />
      <LoansStackNavigator.Screen
        name="ViewContactLoans"
        component={ViewContactLoansScreen}
      />
      <LoansStackNavigator.Screen
        name="ContactsList"
        component={ContactsListScreen}
      />
    </LoansStackNavigator.Navigator>
  );
};

const AccountStackNavigator = createStackNavigator();

export const AccountNavigator = ({ navigation }) => {
  return (
    <AccountStackNavigator.Navigator
      screenOptions={defaultNavOptions}
    >
      <AccountStackNavigator.Screen
        name="Settings"
        component={SettingsScreen}
      />
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

const TabNavigator = createBottomTabNavigator();

export const SplitterNavigator = () => {
  return (
    <TabNavigator.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Track Loans") {
            iconName = "md-cash";
          } else if (route.name === "My Bills") {
            iconName = "ios-list-box";
          } else if (route.name === "Settings") {
            iconName = "md-settings";
          } 

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.blue1,
        inactiveTintColor: Colors.gray,
      }}
    >
      <TabNavigator.Screen name="Track Loans" component={LoansNavigator} />
      <TabNavigator.Screen name="My Bills" component={BillsNavigator} />

      <TabNavigator.Screen name="Settings" component={AccountNavigator} />
    </TabNavigator.Navigator>
  );
};

// const SplitterDrawerNavigator = createDrawerNavigator();

// export const SplitterNavigator = () => {
//   // this dispatch line was brought out fr om drawerContent
//   const dispatch = useDispatch();

//   return (
//     <SplitterDrawerNavigator.Navigator
//       drawerContent={(props) => {
//         return (
//           <ScrollView
//             contentContainerStyle={{
//               flex: 1,
//               paddingTop: 20,
//               justifyContent: "space-between",
//             }}
//           >
//             <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
//               <DrawerItemList {...props} />
//             </SafeAreaView>
//             <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
//               <Button
//                 title="Logout"
//                 color={Colors.blue1}
//                 onPress={() => {
//                   dispatch(authActions.logout());
//                 }}
//               />
//             </SafeAreaView>
//           </ScrollView>
//         );
//       }}
//       drawerContentOptions={{
//         activeTintColor: Colors.blue1,
//       }}
//     >
//        <SplitterDrawerNavigator.Screen
//         name="Loans"
//         component={LoansNavigator}
//         screenOptions={{
//           drawerIcon: (props) => (
//             <Ionicons
//               name={Platform.OS === "android" ? "md-list" : "ios-list"}
//               size={23}
//               color={props.color}
//             />
//           ),
//         }}
//       />
//       <SplitterDrawerNavigator.Screen
//         name="Bills"
//         component={BillsNavigator}
//         screenOptions={{
//           drawerIcon: (props) => (
//             <Ionicons
//               name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
//               size={23}
//               color={props.color}
//             />
//           ),
//         }}
//       />

//       <SplitterDrawerNavigator.Screen
//         name="Account"
//         component={AccountNavigator}
//         screenOptions={{
//           drawerIcon: (props) => (
//             <Ionicons
//               name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
//               size={23}
//               color={props.color}
//             />
//           ),
//         }}
//       />
//     </SplitterDrawerNavigator.Navigator>
//   );
// };

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "roboto-regular",
    flex: 1,
    alignSelf: "center",
  },
});
