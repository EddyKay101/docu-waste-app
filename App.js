import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScanScreen from "./src/screens/ScanScreen";
import WasteScreen from "./src/screens/WasteScreen";
import SplashScreen from './src/screens/SplashScreen';
import ReportScreen from './src/screens/ReportScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();
export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused }) => {
                            let iconName;
                            switch (route.name) {
                                case 'Splash':
                                    iconName = focused ? 'home' : 'home-circle-outline';
                                    break;
                                case 'Scan':
                                    iconName = focused ? 'barcode-scan' : 'barcode';
                                    break;
                                case 'Waste':
                                    iconName = focused ? 'trash-can' : 'trash-can-outline';
                                    break;
                                case 'Report':
                                    iconName = focused ? 'chart-scatter-plot' : 'chart-bar'
                            }
                            return <MaterialCommunityIcons name={iconName} size={32} color={iconName = focused ? '#004d40' : 'black'} />;
                        },
                        headerShown: false,
                        tabBarShowLabel: false
                    })}>
                    <Tab.Screen name="Splash" component={SplashScreen} />
                    <Tab.Screen name="Scan" component={ScanScreen} />
                    <Tab.Screen name="Waste" component={WasteScreen} />
                    <Tab.Screen name="Report" component={ReportScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
