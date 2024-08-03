import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useHighlightStore = defineStore('highlight', () => {
  // Stan
  const documents = ref([]);
  const selectedDocument = ref(null);

  // Akcje
  function setSelectedDocument(doc) {
    selectedDocument.value = doc;
  }
  function setDocuments(data) {
    documents.value = data;
  }

  function overwriteDocument(newContent) {
    console.log(newContent);
    const docToReplace = documents.value.find((doc) => doc.id === selectedDocument.value.id);
    docToReplace.text = newContent;
  }

  function saveDocumentToLocalStorage(document) {
    // Zapisujemy podkreślony dokument
    localStorage.setItem('highlightedDocuments', JSON.stringify(document))
  }

  // Computed properties (jeśli potrzebne, tutaj przykład jako komentarz)
  // const doubleCount = computed(() => count.value * 2);

  return {
    documents,
    selectedDocument,
    setDocuments,
    overwriteDocument,
    setSelectedDocument,
    saveDocumentToLocalStorage
  };
});
