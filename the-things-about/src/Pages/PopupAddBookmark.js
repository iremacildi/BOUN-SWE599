import React, { useState } from 'react'
import {
    createThing,
    saveSolidDatasetAt,
    setThing,
    buildThing
} from "@inrupt/solid-client";
import CustomButton from "../Components/CustomButton";
import { useSession } from "@inrupt/solid-ui-react";
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CustomTextField from '../Components/CustomTextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import CustomSelect from '../Components/CustomSelect';
import { generateBookmarkId } from '../Functions';

const NAME_PREDICATE = "http://schema.org/name";
const CREATED_PREDICATE = "http://www.w3.org/2000/10/annotation-ns#created";
const BOOKMARK_CLASS = "https://schema.org/BookmarkAction";
const TYPE_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const DESCRIPTION_PREDICATE = "https://schema.org/Description";
const URL_PREDICATE = "https://schema.org/url";
const IDENTIFIER_PREDICATE = "https://schema.org/identifier";

function PopupAddBookmark({ bookmarkList, containerUri, refreshTable }) {
    const { session } = useSession();
    const [bookmarkName, setBookmarkName] = useState("");
    const [bookmarkUrl, setBookmarkUrl] = useState("");
    const [bookmarkType, setBookmarkType] = useState("");
    const [bookmarkLabel, setBookmarkLabel] = useState("");
    const [bookmarkComment, setBookmarkComment] = useState("");
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteLabel = () => {
        alert("label deleted!");
    };

    const addBookmark = async () => {
        const newBookmarkThing = buildThing(createThing({ name: generateBookmarkId() }))
            .addStringNoLocale(NAME_PREDICATE, bookmarkName)
            .addDatetime(CREATED_PREDICATE, new Date())
            .addUrl(TYPE_PREDICATE, BOOKMARK_CLASS)
            .addStringNoLocale(DESCRIPTION_PREDICATE, bookmarkComment)
            .addStringNoLocale(URL_PREDICATE, bookmarkUrl)
            .addStringNoLocale(IDENTIFIER_PREDICATE, bookmarkType)
            .build();

        const updatedBookmarkList = setThing(bookmarkList, newBookmarkThing);

        const updatedDataset = await saveSolidDatasetAt(containerUri, updatedBookmarkList, {
            fetch: session.fetch,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        addBookmark();
        setBookmarkName("");
        setOpen(false);
        refreshTable();
    };

    return (
        <React.Fragment>
            <CustomButton onClick={handleClickOpen}>Add New Bookmark</CustomButton>
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle>Add New Bookmark</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <form id="bookmarkForm" onSubmit={handleSubmit} >
                        <Grid container direction="row" id="addmargin">
                            <Grid container item direction="column" lg={2} justifyContent="center" alignItems="flex-start">
                                <InputLabel id="bookmarkName">Name</InputLabel>
                            </Grid>
                            <Grid container item direction="column" lg={10} justifyContent="center" alignItems="flex-start">
                                <CustomTextField
                                    size="small"
                                    name="bookmarkName"
                                    required
                                    fullWidth
                                    id="bookmarkName"
                                    placeholder="Bookmark Name"
                                    InputProps={{
                                        value: (bookmarkName),
                                        onChange: (e) => setBookmarkName(e.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction="row" id="addmargin">
                            <Grid container item direction="column" lg={2} justifyContent="center" alignItems="flex-start">
                                <InputLabel id="bookmarkUrl">URL</InputLabel>
                            </Grid>
                            <Grid container item direction="column" lg={10} justifyContent="center" alignItems="flex-start">
                                <CustomTextField
                                    size="small"
                                    name="bookmarkUrl"
                                    required
                                    fullWidth
                                    id="bookmarkUrl"
                                    placeholder="Bookmark URL"
                                    InputProps={{
                                        value: (bookmarkUrl),
                                        onChange: (e) => setBookmarkUrl(e.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction="row" id="addmargin">
                            <Grid container item direction="column" lg={2} justifyContent="center" alignItems="flex-start">
                                <InputLabel id="bookmarkType">Type</InputLabel>
                            </Grid>
                            <Grid container item direction="column" lg={10} justifyContent="center" alignItems="flex-start">
                                <Select
                                    id="bookmarkType"
                                    value={bookmarkType}
                                    onChange={(e) => setBookmarkType(e.target.value)}
                                    sx={{ maxHeight: 40, width: 'inherit' }}
                                    input={<CustomSelect />}
                                >
                                    <MenuItem value={"Article"}>Article</MenuItem>
                                    <MenuItem value={"Audio"}>Audio</MenuItem>
                                    <MenuItem value={"Blog Post"}>Blog Post</MenuItem>
                                    <MenuItem value={"Scientific"}>Scientific</MenuItem>
                                    <MenuItem value={"Social Media"}>Social Media</MenuItem>
                                    <MenuItem value={"Video"}>Video</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" id="addmargin">
                        <Grid container item direction="column" lg={2} justifyContent="center" alignItems="flex-start">
                                <InputLabel id="bookmarkLabel">Label</InputLabel>
                            </Grid>
                            <Grid container item direction="column" lg={10} justifyContent="center" alignItems="flex-start">
                                <CustomTextField
                                    size="small"
                                    name="bookmarkLabel"
                                    required
                                    fullWidth
                                    id="bookmarkLabel"
                                    placeholder="Bookmark Label"
                                    InputProps={{
                                        value: (bookmarkLabel),
                                        onChange: (e) => setBookmarkLabel(e.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction="row" id="addmargintop">
                            <Grid container item justifyContent="flex-start">
                                <InputLabel id="bookmarkComment">Comment</InputLabel>
                            </Grid>
                            <Grid container item justifyContent="center" alignItems="flex-end">
                                <CustomTextField
                                    size="small"
                                    name="bookmarkComment"
                                    required
                                    fullWidth
                                    id="bookmarkComment"
                                    placeholder="Comment"
                                    multiline
                                    rows={4}
                                    InputProps={{
                                        value: (bookmarkComment),
                                        onChange: (e) => setBookmarkComment(e.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row">
                        <Grid container item justifyContent="flex-end" alignItems="flex-end" lg={12}>
                            <CustomButton id="addmarginright" onClick={handleClose}>Cancel</CustomButton>
                            <CustomButton id="addmarginright" type="submit" form="bookmarkForm">Save</CustomButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default PopupAddBookmark;