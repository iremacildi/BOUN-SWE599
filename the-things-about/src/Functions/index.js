import {
    createSolidDataset,
    getSolidDataset,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";

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