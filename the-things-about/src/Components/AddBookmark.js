import React, { useState } from 'react'
import {
    createThing,
    saveSolidDatasetAt,
    setThing,
    buildThing
} from "@inrupt/solid-client";
import CustomButton from "./CustomButton";
import { useSession } from "@inrupt/solid-ui-react";

const NAME_PREDICATE = "http://schema.org/name";
const CREATED_PREDICATE = "http://www.w3.org/2000/10/annotation-ns#created";
const BOOKMARK_CLASS = "https://schema.org/BookmarkAction";
const TYPE_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const DESCRIPTION_PREDICATE = "https://schema.org/Description";
const URL_PREDICATE = "https://schema.org/url";

function AddBookmark({ bookmarkList, setBookmarkList, containerUri }) {
    const { session } = useSession();
    const [bookmarkName, setBookmarkName] = useState("");

    const addBookmark = async (name) => {
        const newBookmarkThing = buildThing(createThing({ name: name }))
            .addStringNoLocale(NAME_PREDICATE, name)
            .addDatetime(CREATED_PREDICATE, new Date())
            .addUrl(TYPE_PREDICATE, BOOKMARK_CLASS)
            .addStringNoLocale(DESCRIPTION_PREDICATE, "this is a description!")
            .addStringNoLocale(URL_PREDICATE, "https://www.wizardingworld.com/")
            .build();

        const updatedBookmarkList = setThing(bookmarkList, newBookmarkThing);
        const updatedDataset = await saveSolidDatasetAt(containerUri, updatedBookmarkList, {
            fetch: session.fetch,
        });
        setBookmarkList(updatedDataset);
    };

    const handleSubmit = async (event) => {
        alert(bookmarkName)
        event.preventDefault();
        addBookmark(bookmarkName);
        setBookmarkName("");
    };

    const handleChange = (e) => {
        e.preventDefault();
        setBookmarkName(e.target.value);
    };

    return (
        <form className="bookmark-form" onSubmit={handleSubmit}>
            <label htmlFor="bookmark-input">
                <input
                    id="bookmark-input"
                    type="name"
                    value={bookmarkName}
                    onChange={handleChange}
                />
            </label>
            <CustomButton className="add-button" type="submit">Add Bookmark</CustomButton>
        </form>
    );
}

export default AddBookmark;