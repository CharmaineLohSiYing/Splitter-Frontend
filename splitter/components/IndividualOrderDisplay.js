import React, { PureComponent } from "react";
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

class IndividualOrderDisplay extends React.Component {
  

    render() {
        return (
            <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() =>{this.props.onSelect(this.props.id)}}> 
                <Text>{this.props.name}</Text>
                <Text>${this.props.amount}</Text>
            </TouchableOpacity>
          );
    }
  }

  const styles =  StyleSheet.create({
    container:{
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between'
    }
  })
export default IndividualOrderDisplay;