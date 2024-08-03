<script setup>
import {  onMounted, ref } from 'vue'
import { getHightLightsLocalStorage } from "@/utils/localStorage.js";
import data from '@/data/mock-data.json'

let documents = ref(data)
let selectedDocument =  ref(null);

onMounted(() => {
  loadDocumentsFromLocalStorage();
});

const markText = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (selectedText) {
      const span = document.createElement('span');
      span.className = 'highlight';
      span.appendChild(document.createTextNode(selectedText));
      range.deleteContents();
      range.insertNode(span);
      selection.removeAllRanges();
      getNewDocumentContent();
    }
  }
}
const getNewDocumentContent = () => {
  const element = document.querySelector('.document');
  if (element) {
    const updatedContent = element.innerHTML;
    const documentToSave = {
      id: selectedDocument.value.id,
      text: updatedContent
    }

    const documentToReplace = documents.value.find((doc) => doc.id === documentToSave.id)
    documentToReplace.text = documentToSave.text;
    const hasHightLights = document.querySelectorAll('.highlight');
    if (hasHightLights.length) {
      saveDocumentToLocalStorage(documentToSave);
    } else {
      removeDocumentFromLocalStorage(documentToSave);
    }
  }
}
const removeDocumentFromLocalStorage = (d) => {
  const savedHighlights = getHightLightsLocalStorage();
  const updatedDocuments = savedHighlights.filter(doc => doc.id !== d.id);
  localStorage.setItem('highlightedDocuments', JSON.stringify(updatedDocuments));
}
const unmarkText = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const selectedText = selection.toString();

    if (selectedText) {
      const spans = document.querySelectorAll('.highlight');
      spans.forEach(span => {
        if (span.textContent === selectedText) {
          const textNode = document.createTextNode(span.textContent);
          span.parentNode.replaceChild(textNode, span);
        }
      });

      selection.removeAllRanges();
      getNewDocumentContent();
    }
  }
};


const saveDocumentToLocalStorage = (document) => {
  const savedHighlights = getHightLightsLocalStorage();

  const exsistingDocument = savedHighlights.find(doc => doc.id === document.id);
  if (exsistingDocument) {
    Object.assign(exsistingDocument, document);
  } else {
    savedHighlights.push(document);
  }

  localStorage.setItem('highlightedDocuments', JSON.stringify(savedHighlights));
}
  const loadDocumentsFromLocalStorage = () => {
    const savedHighlights = getHightLightsLocalStorage();
    if (!savedHighlights) {
      return;
    }
    savedHighlights.forEach(storedDoc => {
      const documentToUpdate = documents.value.find(doc => doc.id === storedDoc.id);
      if (documentToUpdate) {
        documentToUpdate.text = storedDoc.text;
      }
    });
  }
</script>
<template>
  <button @click="markText">Mark</button>
  <button @click="unmarkText">Unmark</button>
  <div class="container">
    <div class="list">
      <ul>
        <li v-for="document in documents"
            :key="document.id"
            class="list-element"
            @click="selectedDocument = document">ID : {{ document.id }}</li>
      </ul>
    </div>
    <div class="document" v-html=selectedDocument?.text>
    </div>
  </div>
</template>
<style>
button {
  margin: 2px;
}
.container {
  display: flex;
}
.list {
  max-height: 150px;
  width: 100px;
  overflow-y: auto;
  cursor: pointer;
}
.list-element {
  padding: 1px;
}
.document {
  margin-left: 15px;
  max-width: 500px;
}
.highlight {
  background-color: yellow !important;
}
</style>