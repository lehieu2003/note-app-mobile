import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { Spacer } from "../../../components/spacer/spacer.component";
import useNotesStore from "../../../services/notes/notes.zustand";
import { useIsFocused } from "@react-navigation/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

const TitleContainer = styled.View`
  padding: ${(props) => props.theme.space[2]};
  background-color: ${(props) => props.theme.colors.ui.primary};
  border-radius: ${(props) => props.theme.sizes[1]};
`;

const NoteContainer = styled.View`
  flex: 1;
  padding: ${(props) => props.theme.space[2]};
  background-color: ${(props) => props.theme.colors.ui.primary};
  border-radius: ${(props) => props.theme.sizes[1]};
`;

const Loading = styled.ActivityIndicator`
  flex: 1;
`;

const TitleInput = styled.TextInput`
  font-size: 25px;
  color: ${(props) => props.theme.colors.text.primary};
`;

const ContentInput = styled.TextInput`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text.primary};
`;

export const EditNoteScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const { noteId } = route.params;
  const [id, setId] = useState(noteId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date());
  const [newNote, setNewNote] = useState(false);
  const { getNote, updateNote, addNote, removeNote, isLoading } =
    useNotesStore();

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const fetchNoteData = async () => {
    try {
      const noteData = await getNote(id);
      if (noteData) {
        setTitle(noteData.title);
        setContent(noteData.content);
        setDate(new Date(noteData.date));
        setNewNote(false);
      } else {
        setNewNote(true);
      }
    } catch (error) {
      console.error("Error fetching note data:", error);
    }
  };

  const handleFinishEdit = () => {
    if (title.trim() === "" && content.trim() === "") {
      if (!newNote) {
        removeNote(id);
      }
    } else {
      const updatedNote = {
        id,
        title: title.trim(),
        content: content.trim(),
        date: new Date(),
      };
      newNote ? addNote(updatedNote) : updateNote(updatedNote);
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, [id]);

  useEffect(() => {
    if (!isFocused) {
      handleFinishEdit();
    }
  }, [isFocused]);

  const handleContentChange = (newContent) => {
    setUndoStack([...undoStack, content]);
    setRedoStack([]);
    setContent(newContent);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastContent = undoStack.pop();
      setRedoStack([...redoStack, content]);
      setContent(lastContent);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastUndoneContent = redoStack.pop();
      setUndoStack([...undoStack, content]);
      setContent(lastUndoneContent);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={handleUndo}
            disabled={undoStack.length === 0}
          >
            <Ionicons
              name="arrow-undo-outline"
              size={24}
              color={
                undoStack.length > 0
                  ? theme.colors.text.primary
                  : theme.colors.text.disabled
              }
            />
          </TouchableOpacity>
          <Spacer position="right" size="medium" />
          <TouchableOpacity
            onPress={handleRedo}
            disabled={redoStack.length === 0}
          >
            <Ionicons
              name="arrow-redo-outline"
              size={24}
              color={
                redoStack.length > 0
                  ? theme.colors.text.primary
                  : theme.colors.text.disabled
              }
            />
          </TouchableOpacity>
          <Spacer position="right" size="medium" />
        </View>
      ),
    });
  }, [undoStack, redoStack]);

  return (
    <Container>
      <Spacer position="top" size="large" />
      {isLoading ? (
        <SafeArea>
          <Loading animating={true} color="tomato" size={100} />
        </SafeArea>
      ) : (
        <>
          <TitleContainer>
            <TitleInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={theme.colors.text.secondary}
            />
          </TitleContainer>
          <NoteContainer>
            <ContentInput
              placeholder="Write something..."
              value={content}
              onChangeText={handleContentChange}
              multiline
              placeholderTextColor={theme.colors.text.secondary}
            />
          </NoteContainer>
        </>
      )}
    </Container>
  );
};
