import { create } from "zustand"; // Corrected import statement
import AsyncStorage from "@react-native-async-storage/async-storage";

const useNotesStore = create((set, get) => ({
  // initial state
  notes: [],
  keyword: "",
  isLoading: false,
  submittedKeyword: "",

  setKeyword: (keyword) => set({ keyword }),
  setSubmittedKeyword: (submittedKeyword) => set({ submittedKeyword }),
  setIsLoading: (isLoading) => set({ isLoading }),

  // fetch all notes
  getNotes: async () => {
    set({ isLoading: true });
    try {
      const keys = await AsyncStorage.getAllKeys();
      const storedNotes = await AsyncStorage.multiGet(keys);
      let parsedNotes = storedNotes.map((note) => JSON.parse(note[1]));

      const submittedKeyword = get().submittedKeyword;
      if (submittedKeyword) {
        parsedNotes = parsedNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(submittedKeyword.toLowerCase()) ||
            note.content.toLowerCase().includes(submittedKeyword.toLowerCase())
        );
      }

      // sort notes by date recency
      parsedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
      set({
        notes: parsedNotes,
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  // get a specific note by ID
  getNote: async (id) => {
    set({ isLoading: true });
    try {
      const noteDate = await AsyncStorage.getItem(`@note-${id}`);
      set({
        isLoading: false,
      });
      return JSON.parse(noteData);
    } catch (error) {
      console.log("error retrieving note data", error);
      set({ isLoading: false });
      return null;
    }
  },

  // add a new note
  addNote: async (note) => {
    const { notes } = get();
    const updatedNotes = [...notes, note];
    set({ notes: updatedNotes });
    try {
      await AsyncStorage.setItem(`@note-${note.id}`, JSON.stringify(note));
    } catch (error) {
      console.log("error adding note", error);
    }
  },

  // remove a note by ID
  removeNote: async (id) => {
    const { notes } = get();
    const updatedNotes = notes.filter((note) => note.id !== id);
    set({ notes: updatedNotes });
    try {
      await AsyncStorage.removeItem(`@note-${id}`);
    } catch (error) {
      console.log("error removing note", error);
    }
  },

  // update an existing note
  updateNote: async (note) => {
    const { notes } = get();
    const updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
    set({
      notes: updatedNotes,
    });
    try {
      await AsyncStorage.setItem(`@note-${note.id}`, JSON.stringify(note));
    } catch (error) {
      console.log("error updating note", error);
    }
  },

  onSearch: (searchKeyword) => {
    set({ submittedKeyword: searchKeyword, keyword: searchKeyword });
    get().getNotes();
  },

  search: (searchKeyword) => {
    set({ submittedKeyword: searchKeyword, keyword: searchKeyword });
    get().getNotes();
  },
}));

export default useNotesStore;
