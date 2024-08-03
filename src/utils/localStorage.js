export function getHightLightsLocalStorage() {
 return JSON.parse(localStorage.getItem('highlightedDocuments')) || [];
}