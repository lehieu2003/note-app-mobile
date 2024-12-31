import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import useNotesStore from "../services/notes/notes.zustand";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { addNote } = useNotesStore();

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString(),
    };
    addNote(newNote);
    setTitle("");
    setContent("");
  };

  return (
    <View>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
      />
      <Button title="Add Note" onPress={handleAddNote} />
    </View>
  );
};

export default AddNote;
