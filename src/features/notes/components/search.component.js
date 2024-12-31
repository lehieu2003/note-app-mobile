import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Searchbar } from "react-native-paper";
import { useTheme } from "styled-components";
import useNotesStore from "../../../services/notes/notes.zustand";
import { debounce } from "lodash";

const SearchContainer = styled.View`
  padding-vertical: ${(props) => props.theme.space[3]};
  padding-horizontal: ${(props) => props.theme.space[3]};
  z-index: 999;
  width: 100%;
`;

export const Search = () => {
  const { keyword, search } = useNotesStore();

  const [searchKeyword, setSearchKeyword] = useState(keyword);

  const theme = useTheme();

  const debouncedSearch = debounce((text) => {
    search(text);
  }, 500);

  useEffect(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Clean up debounce on unmount
    };
  }, []);

  const handleChangeText = (text) => {
    setSearchKeyword(text);
    debouncedSearch(text.trim());
  };

  return (
    <SearchContainer>
      <Searchbar
        placeholder="Search notes"
        accessibilityLabel="Search bar"
        accessibilityHint="Enter a keyword to search your notes"
        style={{
          backgroundColor: theme.colors.ui.primary,
          height: 48,
          borderRadius: 20,
        }}
        inputStyle={{
          paddingBottom: 8,
          color: theme.colors.text.primary,
          textAlignVertical: "center",
        }}
        placeholderTextColor={theme.colors.text.disabled}
        cursorColor={theme.colors.text.primary}
        value={searchKeyword}
        onChangeText={handleChangeText}
        onSubmitEditing={() => {
          if (searchKeyword.trim()) {
            search(searchKeyword.trim());
          }
        }}
      />
    </SearchContainer>
  );
};
