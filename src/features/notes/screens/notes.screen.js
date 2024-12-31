import React, { useState } from "react";
import { FAB } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Search } from "../components/search.component";
import MasonryList from "@react-native-seoul/masonry-list";
import { NoteCard } from "../components/note-card.component";
import { formatDate } from "../../../infrastructure/utility/formatDate";
import useNotesStore from "../../../services/notes/notes.zustand";
import { Text } from "../../../components/typography/text.component";

import { Ionicons } from "@expo/vector-icons";

const Loading = styled.ActivityIndicator`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
`;

const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.bg.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.ui.secondary};
  padding: 8px 16px;
`;

const StyledFAB = styled(FAB)`
  z-index: 999;
  position: absolute;
  margin: 25px;
  right: 0;
  bottom: 0;
  border-radius: 50px;
  background-color: tomato;
`;

export const NotesScreen = ({ navigation }) => {
  const theme = useTheme();
  const { notes, removeNote, isLoading, keyword } = useNotesStore();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedNotes([]);
  };

  const toggleNoteSelection = (noteId) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const deleteSelectedNotes = async () => {
    try {
      await Promise.all(selectedNotes.map((noteId) => removeNote(noteId)));
      toggleSelectionMode();
    } catch (error) {
      console.error("Error deleting notes:", error);
    }
  };

  const undoContent = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack.pop();
      setRedoStack([...redoStack, lastAction]);
      // Apply the undo action
      // Example: setContent(lastAction.previousContent);
    }
  };

  const redoContent = () => {
    if (redoStack.length > 0) {
      const lastUndoneAction = redoStack.pop();
      setUndoStack([...undoStack, lastUndoneAction]);
      // Apply the redo action
      // Example: setContent(lastUndoneAction.newContent);
    }
  };

  return (
    <SafeArea>
      {selectionMode && (
        <TopBar>
          <TouchableOpacity onPress={toggleSelectionMode}>
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={{ color: theme.colors.text.primary }}>
            {selectedNotes.length} selected
          </Text>
          <TouchableOpacity onPress={deleteSelectedNotes}>
            <Ionicons
              name="trash"
              size={24}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </TopBar>
      )}

      <StyledFAB
        small
        icon="plus"
        color="white"
        onPress={() => {
          navigation.navigate("EditNote", {
            noteId: Date.now() + Math.floor(Math.random() * 1000),
            undoContent,
            redoContent,
            contentUndoStackLength: undoStack.length,
            contentRedoStackLength: redoStack.length,
          });
        }}
      />
      <Search />
      <Container>
        {isLoading ? (
          <Loading animating={true} color="tomato" size={100} />
        ) : notes.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: theme.colors.text.primary,
            }}
          >
            No notes available
          </Text>
        ) : (
          <MasonryList
            contentContainerStyle={{ paddingHorizontal: 10 }}
            numColumns={2}
            data={notes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => {
                  if (!selectionMode) toggleSelectionMode();
                  toggleNoteSelection(item.id);
                }}
                onPress={() => {
                  if (selectionMode) toggleNoteSelection(item.id);
                  else navigation.navigate("EditNote", { noteId: item.id });
                }}
              >
                <NoteCard
                  id={item.id}
                  title={item.title}
                  paragraph={item.content}
                  date={formatDate(new Date(item.date))}
                  keyword={keyword}
                  selected={selectedNotes.includes(item.id)}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </Container>
    </SafeArea>
  );
};
