import React, { useEffect, useState } from 'react'
import {
    addDatetime,
    addStringNoLocale,
    createThing,
    getSourceUrl,
    saveSolidDatasetAt,
    setThing,
    addUrl
} from "@inrupt/solid-client";
import CustomButton from "./CustomButton";
import { useSession } from "@inrupt/solid-ui-react";

const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://www.w3.org/2000/10/annotation-ns#created";
const BOOKMARK_CLASS = "http://www.w3.org/2002/01/bookmark#Bookmark";
const TYPE_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const DESCRIPTION_PREDICATE = "http://purl.org/dc/elements/1.1/#description";
const RECALLS_PREDICATE = "http://www.w3.org/2002/01/bookmark#recalls";
const TITLE_PREDICATE = "http://purl.org/dc/elements/1.1/#title";
//rdf: is <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//dc: are <http://purl.org/dc/elements/1.1/>
//a: is <http://www.w3.org/2000/10/annotation-ns#>
//rdf:type should be BOOKMARK_CLASS

{/* <rdf:Description rdf:about="file:///home/.amaya/bookmarks.rdf#ambookmark7">
  <rdf:type rdf:resource="http://www.w3.org/2002/01/bookmark#Bookmark"/>
  <b:recalls rdf:resource="https://www.wizardingworld.com/"/>
  <dc:title>Wizarding World</dc:title>
  <dc:description>Wizarding World includes Harry Potter and Fantastic Beasts.</dc:description>
  <a:created>2022-05-06T22:35:00-00:00</a:created>
</rdf:Description> */}

function AddBookmark({ bookmarkList, setBookmarkList }) {
    const { session } = useSession();
    const [bookmarkText, setBookmarkText] = useState("");

    const addBookmark = async (text) => {
        const indexUrl = getSourceUrl(bookmarkList);
        const bookmarkWithText = addStringNoLocale(createThing(), TEXT_PREDICATE, text);
        const bookmarkWithDate = addDatetime(
            bookmarkWithText,
            CREATED_PREDICATE,
            new Date()
        );
        const bookmarkWithType = addUrl(bookmarkWithDate, TYPE_PREDICATE, BOOKMARK_CLASS);
        console.log(bookmarkWithType);
        console.log('--------------------');
        const updatedBookmarkList = setThing(bookmarkList, bookmarkWithType);
        const updatedDataset = await saveSolidDatasetAt(indexUrl, updatedBookmarkList, {
            fetch: session.fetch,
        });
        setBookmarkList(updatedDataset);
        console.log(updatedBookmarkList);
        console.log('*******************');
        console.log(updatedDataset);
        console.log('++++++++++++++++++++');
    };

    const handleSubmit = async (event) => {
        alert(bookmarkText)
        event.preventDefault();
        addBookmark(bookmarkText);
        setBookmarkText("");
    };

    const handleChange = (e) => {
        e.preventDefault();
        setBookmarkText(e.target.value);
    };

    return (
        <form className="bookmark-form" onSubmit={handleSubmit}>
            <label htmlFor="bookmark-input">
                <input
                    id="bookmark-input"
                    type="text"
                    value={bookmarkText}
                    onChange={handleChange}
                />
            </label>
            <CustomButton className="add-button" type="submit">Add Bookmark</CustomButton>
        </form>
    );
}

export default AddBookmark;