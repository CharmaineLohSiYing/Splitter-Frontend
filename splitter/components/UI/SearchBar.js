import React from "react";
import { View, TextInput } from "react-native";
import GlobalStyles from "../../assets/style"

const SearchBar = (props) => {
  return (
    <View style={GlobalStyles.searchBar}>
        <View style={GlobalStyles.searchBarIcon}></View>
        <TextInput
          style={{flex: 1}}
          value={props.query}
          onChangeText={props.handleSearch}
          placeholder="Finding someone?"
        />
      </View>
  );
};


export default SearchBar;
