import React, { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import useNotesStore from "../services/notes/notes.zustand";

const NoteList = () => {
  const { notes, getNotes, isLoading } = useNotesStore();

  useEffect(() => {
    getNotes();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
          <Text>{item.content}</Text>
        </View>
      )}
    />
  );
};

export default NoteList;
