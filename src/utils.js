/**
 * Query String To Object
 * turn a query string `window.location.search` into a key/value object
 * e.g. '?a=b' => { a: 'b' } 
 * @param {string} key 
 */
export const qs2obj = qs => {
    return qs
        .substring(location.search.indexOf('?') + 1)
        .split('&')
        .reduce(
            (r, v) => (
                { ...r, [v.split('=')[0]]: v.split('=')[1] }
            ), {}
        );
}

/**
 * Bytes To Size String
 * turn a byte count into a human readable amount
 * e.g. 1000 => 1KB
 * @param {number} bytes
 */
const SIZE_SUFFIX = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
export const bytes2size = bytes => {
    if (bytes === 0) {
        return '0 Bytes';
    }

    let idx = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (
        Math.round(bytes / Math.pow(1024, idx), 2) + ' ' + SIZE_SUFFIX[idx]
    );
}

/**
 * Escape HTML Special Characters
 * @param {string} str
 */
export const escapeHTML = str => {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;')
        .replace(/`/g, '&#x60;')
        .replace(/=/g, '&#x3D;');
}

/**
 * Escape URI Special Characters
 * @param {string} str
 */
export const escapeURI = str => {
    return String(str)
        .split('/')
        .map(encodeURIComponent)
        .join('/');
}