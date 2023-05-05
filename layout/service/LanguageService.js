export const LanguageService = {
    getLanguages() {
        return fetch('/data/languages.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
};
