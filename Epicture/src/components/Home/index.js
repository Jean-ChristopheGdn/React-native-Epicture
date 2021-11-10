import React from 'react';
import { View, StyleSheet, Button } from "react-native";



const Home = ({ navigation }) => {

    return (
        <View style={styles.container} >
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "stretch", backgroundColor: "lightblue", borderRadius: 50  }}>
                    <Button 
                        onPress={() => {
                            navigation.navigate("Rechercher")
                        }}
                        title="Rechercher"
                    />
                </View>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "stretch", backgroundColor: "lightgreen", borderRadius: 50  }}>
                    <Button
                        onPress={() => {
                            navigation.navigate("Aléatoire")
                        }}
                        title="Images Aléatoires"
                    />
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "stretch", backgroundColor: "#FF5E4D", borderRadius: 50  }}>
                    <Button
                        onPress={() => {
                            navigation.navigate("Images")
                        }}
                        title="Mes images"
                    />
                </View>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "stretch", backgroundColor: "#FFFF6B", borderRadius: 50 }}>
                    <Button
                        onPress={() => {
                            navigation.navigate("Profile")

                        }}
                        title="Profile"
                    />
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },

});
export default Home;
