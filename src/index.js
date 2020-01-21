import * as moment from 'moment-mini';
import { parse } from 'fast-xml-parser';
import './index.css';

const SIZE_SUFFIX = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
const CONFIG = {
    Region: 'ap-southeast-2',
    Bucket: 'dl.benfleming.nz',
    Prefix: '',
    Delimiter: '/'
};

/**
* Build S3 URL 
*/
const buildUrl = () => (
    CONFIG.Region === 'us-east-1'
        ? `${location.protocol}//${CONFIG.Bucket}.s3.amazonaws.com/`
        : `${location.protocol}//${CONFIG.Bucket}.s3-${CONFIG.Region}.amazonaws.com/`
);

const querystring = key => {
    let qs = location.search
        .substring(location.search.indexOf('?') + 1)
        .split('&')
        .reduce(
            (r, v) => (
                { ...r, [v.split('=')[0]]: v.split('=')[1] }
            ), {}
        );
    return qs[key] || '';
}

const prefix = (action='get', value='') => {
    switch (action) {
        case 'get': 
            return (
                querystring('prefix').replace(/(^\/|\/$)/, '')
            );

        case 'set':
            location.search = `?prefix=${escapeURI(value)}`;
            break;

        case 'last':
            let tmp = prefix().split('/').pop();
            return (
                tmp[0] || '/'
            );
    }
}

/**
 * Bytes To Size String
 * turn a byte count into a human readable amount
 * e.g. 1000 => 1KB
 * @param {number} bytes
 */
const bytes2size = bytes => {
    if (bytes === 0) {
        return '0 Bytes';
    }

    let idx = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (
        Math.round(bytes / Math.pow(1024, idx), 2) + ' ' + SIZE_SUFFIX[idx]
    );
}

/**
 * S3 Key To HREF Link
 * transform a object key to a http link
 * @param {string} key
 */
const key2href = key => `${buildUrl()}${escapeURI(key)}`

/**
 * Escape HTML Special Characters
 * @param {string} str
 */
const escapeHTML = str => {
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
const escapeURI = str => {
    return String(str)
        .split('/')
        .map(encodeURIComponent)
        .join('/');
}

const main = async () => {
    let { ListBucketResult } = await fetch(`${buildUrl()}?prefix=${CONFIG.Prefix}${prefix()}`)
        .then(res => res.text())
        .then(parse);

    if (prefix() !== '') {
        insertHTML({ 
            Key  : '..', 
            Link : `?prefix=${prefix('last')}`
        })
    }

    for (let { LastModified, Size, Key } of ListBucketResult.Contents) {
        insertHTML({ 
            LastModified : moment(LastModified).format("MMM Do YYYY h:mm:ss a ZZ"), 
            Size         : bytes2size(Size), 
            Key          : escapeHTML(Key), 
            Link         : key2href(Key) 
        })
    }
}

const insertHTML = ({ LastModified='', Size='', Key='', Link='' }) => {
    document
        .querySelector('table#app>tbody')
        .insertAdjacentHTML(
            'beforeend', `
                <tr>
                    <td>${LastModified}</td>
                    <td>${Size}</td>
                    <td>
                        <a href="${Link}">${Key}</a>
                    </td>
                </tr>
            `
        );
}
    
window.addEventListener('DOMContentLoaded', main); 