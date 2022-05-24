import {
    createSolidDataset,
    getSolidDataset,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { parseDomain, ParseResultType } from 'parse-domain';

const rdf = require('rdflib');
const FOAF = new rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = new rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

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

export function friends(me, store) {

    let returnList = [];

    var friends = store.each(me, FOAF('knows'));
    var i, n = friends.length, friend;

    for (i = 0; i < n; i++) {
        friend = friends[i];
        if (friend && friend.termType === 'NamedNode') { //only show people with a WebID for the moment.
            console.log('**************')
            console.log(friend)
            console.log('**************')
            var name = store.any(friend, FOAF('name'))
            console.log(name)
            if (!name) {
                name = friend.uri
            }
            returnList.push(friend.uri + " - " + name)
        }
    }
    console.log('//////////////')
    console.log(returnList)
    console.log('//////////////')

    return returnList;
}

export function runQuery(store, fetcher) {

    var query = "SELECT ?s ?p ?o WHERE { ?s ?p <https://iremacildi.solidcommunity.net/movies/>. ?s ?p ?o } LIMIT 100";

    var eq = rdf.SPARQLToQuery(query, false, store)
    var onresult = function (result) {
        console.log(result)
        alert('hi_1')
    }
    var onDone = function (result) {
        console.log(result)
        alert('hi_2')
    }

    store.query(eq, onresult, fetcher, onDone)

    console.log('hi_3')
}
