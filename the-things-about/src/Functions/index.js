import {
    createSolidDataset,
    getSolidDataset,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { parseDomain, ParseResultType } from 'parse-domain';
const axios = require('axios');
const rdf = require('rdflib');

const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const FOAF = new rdf.Namespace('http://xmlns.com/foaf/0.1/');

export async function getOrCreateBookmarkList(containerUri, fetch) {
    const indexUrl = `${containerUri}`;
    try {
        const bookmarkList = await getSolidDataset(indexUrl, { fetch });
        return bookmarkList;
    } catch (error) {
        if (error.statusCode === 404) {
            const bookmarkList = await saveSolidDatasetAt(
                indexUrl,
                createSolidDataset(),
                {
                    fetch,
                }
            );
            return bookmarkList;
        }
    }
}

export async function getBookmarkList(containerUri, fetch) {
    const indexUrl = `${containerUri}`;
    try {
        const bookmarkList = await getSolidDataset(indexUrl, { fetch });
        return bookmarkList;
    } catch (error) {
        if (error.statusCode === 404) {
            return null;
        }
    }
}

export function getUrlHostname(url) {
    try {
        let domain = (new URL(url));
        domain = domain.hostname;

        let parseResult = parseDomain(domain);
        if (parseResult.type === ParseResultType.Listed) {
            const { domain } = parseResult;
            return domain;
        } else {
            return "unknown";
        }
    } catch (error) {
        return "unknown";
    }
}

export function setHttp(url) {
    if (url.search(/^http[s]?\:\/\//) == -1) {
        url = 'http://' + url;
    }
    return url;
}

export function generateBookmarkId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export const wikidataSearch = async (searchText) => {
    const wikiResult = [];

    try {
        let query = `
        SELECT distinct ?itemLabel ?linkcount #?classLabel ?typeLabel
        WHERE {
          {
            SELECT ?class ?searched_item
            WHERE {
              {
                SELECT ?searched_item {
                  SERVICE wikibase:mwapi {
                    bd:serviceParam wikibase:api "EntitySearch".
                    bd:serviceParam wikibase:endpoint "www.wikidata.org".
                    bd:serviceParam mwapi:search "` + searchText + `".
                    bd:serviceParam mwapi:language "en".
                    ?searched_item wikibase:apiOutputItem mwapi:item.
                    ?num wikibase:apiOrdinal true.
                  }
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
                }
                LIMIT 5
              }
              hint:Prior hint:runFirst true .
              ?searched_item wdt:P279 ?class .
              ?searched_item wdt:P31 ?type .
              SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            }
          }
          hint:Prior hint:runFirst true .
          ?item wdt:P279 ?class .
          ?item wdt:P31 ?type .
          ?item wikibase:sitelinks ?linkcount .
          FILTER(?linkcount > 50).
          FILTER(?item != ?searched_item).
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        ORDER BY ASC(?class) ASC(?type) DESC(?linkcount)`

        const params = new URLSearchParams([['format', 'json'], ['query', query]]);

        const res = await axios.get('https://query.wikidata.org/sparql', { params });

        res.data.results.bindings.forEach((r) => {
            wikiResult.push(r.itemLabel.value)
        })
    } catch (error) {
        console.log(error)
    }

    wikiResult.push(searchText);
    return wikiResult;
};

export let getFriendsList = async (fetcher, store, me) => {

    let friendsList = [];

    await fetcher.load(me);

    let friends = store.each(rdf.sym(me), FOAF('knows')); //get friends

    friends.forEach(async (friend) => {
        await fetcher.load(friend);
        let name = store.each(rdf.sym(friend), VCARD('fn'));
        let pod = friend.value;

        let friendinfo = [name ? name[0].value : '', pod]
        friendsList.push(friendinfo)
    });

    return friendsList;
};