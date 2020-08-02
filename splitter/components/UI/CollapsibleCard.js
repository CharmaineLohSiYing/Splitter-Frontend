import React from 'react'
import {Animated, View, StyleSheet, TouchableHighlight, Text} from 'react-native'

class CollapsibleCard extends React.Component {
    anime = {
        height: new Animated.Value(20),
        expanded: false,
        contentHeight: 0,
    }

    constructor(props) {
        super(props);
        this._initContentHeight = this._initContentHeight.bind(this);
        this.toggle = this.toggle.bind(this);

        this.anime.expanded = props.expanded;
    }

    _initContentHeight(evt) {
        if (this.anime.contentHeight>0) return;
        this.anime.contentHeight = evt.nativeBill.layout.height;
        this.anime.height.setValue(this.anime.expanded ? this._getMaxValue() : this._getMinValue() );
    }

    _getMaxValue() { return this.anime.contentHeight };
    _getMinValue() { return 0 };

    toggle() {
        Animated.timing(this.anime.height, {
            toValue: this.anime.expanded ? this._getMinValue() : this._getMaxValue(),
            duration: 300,
        }).start();
        this.anime.expanded = !this.anime.expanded;
    }

    render() {
        return (
            <View style={styles.titleContainer}>
                <View style={styles.title}>
                    <TouchableHighlight underlayColor="transparent" onPress={this.toggle}>
                        <Text>{this.props.title}</Text>
                    </TouchableHighlight>
                </View>

                <Animated.View style={[styles.content, { height: this.anime.height }]} onLayout={this._initContentHeight}>
                    {this.props.children}
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

})

export default CollapsibleCard