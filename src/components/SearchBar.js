import React from "react";
import { View, TextInput, Button } from "react-native";
import useNotesStore from "../services/notes/notes.zustand";

const SearchBar = () => {
  const { keyword, setKeyword, onSearch } = useNotesStore();

  return (
    <View>
      <TextInput
        placeholder="Search"
        value={keyword}
        onChangeText={setKeyword}
      />
      <Button title="Search" onPress={() => onSearch(keyword)} />
    </View>
  );
};

export default SearchBar;
