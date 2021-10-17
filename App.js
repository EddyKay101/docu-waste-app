import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import ScanScreen from "./src/screens/ScanScreen";
import Products from "./src/components/Products";

const navigator = createStackNavigator({
    Scan: ScanScreen,
    Products: Products
}, {
    initialRouteName: 'Scan',
    defaultNavigationOptions: {
        title: 'Docu Waste'
    }
});

export default createAppContainer(navigator);