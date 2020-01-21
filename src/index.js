import * as moment from 'moment-mini';
import { parse as xml } from 'fast-xml-parser';
import { bytes2size, qs2obj } from './utils';
import { escapeHTML, escapeURI } from './utils';
import './index.css';

class S3Directory {

    constructor () {
        this.prefix = String(qs2obj(location.search)['prefix'] || '').replace(/(^\/|\/$)/, '');
        this.url = (
            CONFIG.Region === 'us-east-1'
                ? `${location.protocol}//s3.amazonaws.com/${CONFIG.Bucket}/`
                : `${location.protocol}//s3-${CONFIG.Region}.amazonaws.com/${CONFIG.Bucket}/`
        );
        this.table = document.querySelector('table#app>tbody');
        this.showFullDate = false;
    }

    /**
     * Parent Directory
     * get the parent directory of the current directory
     * @returns {string}
     */
    parent () {
        return this.prefix.split('/').slice(0, -1).join('/');
    }

    /**
     * Path Info
     * get the file / directory info from only the file name
     * @param {string} key 
     */
    pathinfo (key) {
        return {
            Directory: String(key).split('/').slice(0, -1),
            FileName : String(key).split('/').pop()
        }
    }

    /**
     * Insert HTML To DOM
     * insert a row into the dom with the given values
     * @param {object} options 
     * @returns {void}
     */
    insert ({ LastModified='', Size='', Key='', Link='' }) {
        this.table
            .insertAdjacentHTML(
                'beforeend', `
                    <tr>
                        <td>${LastModified}</td>
                        <td>${Size}</td>
                        <td>
                            <a href="${Link}">${escapeHTML(Key)}</a>
                        </td>
                    </tr>
                `
            );
    }

    /**
     * Render The HTML
     * fetch the list data based on the prefix, and render it to the DOM 
     * @returns {Promise<void>}
     */
    async render () {
        document.title = `${CONFIG.Title || CONFIG.Bucket} | S3 Browser`;

        let SubDirectories = new Set();
        let Contents = await fetch(`${this.url}?prefix=${this.prefix}`)
            .then(res => res.text())
            .then(xml)
            .then(
                ({ ListBucketResult }) => 
                    Array.isArray(ListBucketResult.Contents) 
                        ? ListBucketResult.Contents 
                        : [ListBucketResult.Contents]
            );

        if (this.prefix !== '') {
            this.insert({ Key  : '..', Link : `?prefix=${this.parent()}`  });
        }

        for (let { LastModified, Size, Key } of Contents) {
            if (Key === 'index.html')
                continue;
            
            let RelFileName = Key.replace(this.prefix, '').replace(/(^\/|\/$)/, '');
            let { FileName, Directory } = this.pathinfo(RelFileName);
            
            console.log(
                Key, RelFileName, FileName, Directory
            );

            // check if file is in sub directory
            if (Directory[0] != null && Directory[0] !== '') {
                if (SubDirectories.has(Directory[0]) == false) {
                    SubDirectories.add(Directory[0]); 
                    this.insert({ 
                        Key: Directory[0] + '/', 
                        Link: `?prefix=${[ ...this.prefix.split('/'), Directory[0] ].join('/')}` 
                    });
                }
                continue;
            }
    
            this.insert({ 
                LastModified : moment(LastModified).format(CONFIG.DateFormat), 
                Size         : bytes2size(Size), 
                Key          : FileName, 
                Link         : `${this.url}${escapeURI(Key)}`
            })
        }
    }

}

window.addEventListener(
    'DOMContentLoaded', () => new S3Directory().render()
); 