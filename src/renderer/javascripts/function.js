export function isValidUrl(url){
    url = url.replace(/\s/g, '');
    if(!url.length) return "";
    const result = /^(http[s]?:\/\/){1}[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g.test(url);
    return result ? url : "";
}

