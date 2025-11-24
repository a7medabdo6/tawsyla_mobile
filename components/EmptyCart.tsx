import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet } from "react-native";
import Button from "./Button";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
const EmptyCart = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    return (
        <View style={styles.container}>
 <Ionicons
                  name="cart-outline"
                  size={50}
                  style={styles.icon}
                  color="black"
                />            <Text style={styles.text}>السلة فارغة</Text>
                <Text style={styles.text}>لا يوجد لديك أي منتجات في السلة</Text>
                <Button
                        title="العودة للرئيسية"
                        onPress={()=>{
                            navigation.navigate("index")
                        }}
                        style={styles.button}
                        filled
                />
        </View>
    );
};
export default EmptyCart;
const styles = StyleSheet.create({
    container:{
        marginTop:"40%",
       borderRadius: 16,
           padding: 32,
           alignItems: "center",
           justifyContent: "center",
           flex: 1,
           alignSelf: "center",
    
    },
    icon:{
        width:50,
        height:50,
        color:COLORS.primary,
    },
    text:{
        fontSize:16,
        fontWeight:"bold",
        textAlign:"center",
        color:COLORS.blackTie
    },
    button:{
        marginTop:20,
    
              width: 160,
    borderRadius: 30,
    }
})  