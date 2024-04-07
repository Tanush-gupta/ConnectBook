import { Button, StatusBar, StyleSheet, Text, View } from 'react-native';
import Activity from '../tabs/Activity';
import Search from '../tabs/Search';
import Upload from '../tabs/Upload';
import Messages from '../tabs/Messages';
import Profile from '../tabs/Profile';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/Feather';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { DARK_MODE } from 'nativewind/dist/utils/selector';
import { A1, A2, B1, B2 } from '../colors';
export default function MainScreen({ navigation }) {
    const Tab = createMaterialBottomTabNavigator();

    return (
        <Tab.Navigator
            initialRouteName="Activity"
            labeled={false}
            activeColor={A1}
            shifting={false}
            theme={DARK_MODE}
            barStyle={{
                position: 'relative',
                backgroundColor: '#f2f4f7',
                borderRadius: 20,
                overflow: 'hidden',
                marginHorizontal: 4,
            }}
            activeIndicatorStyle={{
                backgroundColor: "white",
                padding: 2
            }}

        >
            <Tab.Screen
                name="Activity"
                component={Activity}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="home" color={color} size={30} />,
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon1 name="search" color={color} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="Upload"
                component={Upload}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon1 name="upload" color={color} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="Message"
                component={Messages}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="message" color={color} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Icon1 name="user" color={color} size={30} />
                    ),
                }}
            />
        </Tab.Navigator>



    );
}

const styles = StyleSheet.create({});
