import React from "react";
import { View, TouchableOpacity } from "react-native";
import { EditNoteScreen } from "../../features/notes/screens/edit_note.screen";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { Spacer } from "../../components/spacer/spacer.component";
import { NotesScreen } from "../../features/notes/screens/notes.screen";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components";
const NotesStack = createStackNavigator();

export const NotesNavigator = ({ route, navigation }) => {
  const theme = useTheme();

  return (
    <NotesStack.Navigator
      screenOptions={{
        headerShown: true,
        headermode: "screen",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <NotesStack.Screen
        name="AllNotes"
        component={NotesScreen}
        options={{ header: () => null }}
      />
      <NotesStack.Screen
        name="EditNote"
        component={EditNoteScreen}
        headermode="screen"
        options={({ route }) => ({
          headerTitle: "",
          headerStyle: {
            backgroundColor: theme.colors.bg.secondary,
          },
          headerTintColor: theme.colors.text.primary,
        })}
      />
    </NotesStack.Navigator>
  );
};
