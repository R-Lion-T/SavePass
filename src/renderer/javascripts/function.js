export function isValidUrl(url) {
    url = url.replace(/\s/g, "");
    if (!url.length) return "";
    const result =
        /^(http[s]?:\/\/){1}[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g.test(
            url
        );
    return result ? url : "";
}

// проверка на совпадение текста
export function isMatch(title, key) {
    if (title.includes(key)) return true;

    // проверка количество совадений букв в тексте
    let assecc = 0,
        bad = 0;

    for (let i = 0; i < key.length; i++) {
        key[i] == title[i] ? assecc++ : bad++;
    }
    return assecc > bad && bad < 4;
}
// sort a>z
export function sortAscending(a, b) {
    const tA = a.title[0].toLowerCase();
    const tB = b.title[0].toLowerCase();
    if (tA[0] < tB[0]) {
        return -1;
    }
    if (tA[0] > tB[0]) {
        return 1;
    }
    return 0;
}
