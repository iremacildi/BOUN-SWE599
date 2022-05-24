import {
    createSolidDataset,
    getSolidDataset,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { parseDomain, ParseResultType } from 'parse-domain';

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