import React from "react";
import { View, Text } from "react-native";
import useNotesStore from "../services/notes/notes.zustand";

const NoteDetail = ({ route }) => {
  const { id } = route.params;
  const { getNote, isLoading } = useNotesStore();
  const [note, setNote] = React.useState(null);

  React.useEffect(() => {
    const fetchNote = async () => {
      const fetchedNote = await getNote(id);
      setNote(fetchedNote);
    };
    fetchNote();
  }, [id]);

  if (isLoading || !note) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>{note.title}</Text>
      <Text>{note.content}</Text>
    </View>
  );
};

export default NoteDetail;
