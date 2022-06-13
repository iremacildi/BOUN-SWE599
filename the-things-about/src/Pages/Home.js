import { useEffect, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton } from '@mui/material';
import logo from '../img/TTAlogo.png'
import CustomButton from '../Components/CustomButton';
import CustomTable from '../Components/CustomTable';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchBar from '../Components/SearchBar';
import PopupAddBookmark from './PopupAddBookmark';
import { useSession, CombinedDataProvider } from "@inrupt/solid-ui-react";
import PopupWelcome from './PopupWelcome';
import PopupFilter from './PopupFilter';
import {
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
    getStringNoLocale,
    getPodUrlAll,
    removeThing,
    saveSolidDatasetAt
} from "@inrupt/solid-client";
import { getOrCreateBookmarkList, getBookmarkList, wikidataSearch } from '../Functions';
import { SessionProvider, LogoutButton } from "@inrupt/solid-ui-react";
import { useNavigate } from "react-router-dom";
const rdf = require('rdflib');

const NAME_PREDICATE = "http://schema.org/name";
const SCHEM = new rdf.Namespace("https://schema.org/");
const SCHEMA = new rdf.Namespace("http://schema.org/");
const DESCRIPTION_PREDICATE = "https://schema.org/Description";
const URL_PREDICATE = "https://schema.org/url";
const IDENTIFIER_PREDICATE = "https://schema.org/identifier";
const FOAF = new rdf.Namespace('http://xmlns.com/foaf/0.1/');
const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage";

function Home() {
    const { session } = useSession();
    const [bookmarkList, setBookmarkList] = useState();
    const [bookmarkTableRows, setBookmarkTableRows] = useState([]);
    const [containerUri, setContainerUri] = useState();
    const [tableKey, setTableKey] = useState(0);
    const [me, setMe] = useState();
    const [open, setOpen] = useState(false);
    const [openLogout, setOpenLogout] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState();
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    useEffect(() => {
        if (!session || !session.info.isLoggedIn) return;

        (async () => {
            setMe(store.sym(session.info.webId));
            window.solidFetcher = session.clientAuthentication.fetch;

            const profileDataset = await getSolidDataset(session.info.webId, {
                fetch: session.fetch,
            });
            const profileThing = getThing(profileDataset, session.info.webId);
            const podsUrls = getUrlAll(profileThing, STORAGE_PREDICATE);
            const pod = podsUrls[0];
            setContainerUri(`${pod}bookmarks`);

            const list = await getOrCreateBookmarkList(containerUri, session.fetch);
            setBookmarkList(list);

            const _bookmarkTableData = getThingAll(list)
            var _bookmarkTableRows = [];
            _bookmarkTableData.map((bm) => {
                const _bookmarkThingAddress = bm.url
                const _bookmarkName = getStringNoLocale(bm, NAME_PREDICATE)
                const _bookmarkType = getStringNoLocale(bm, IDENTIFIER_PREDICATE)
                const _bookmarkSource = getStringNoLocale(bm, URL_PREDICATE)
                const _bookmarkComment = getStringNoLocale(bm, DESCRIPTION_PREDICATE)
                _bookmarkTableRows = _bookmarkTableRows.concat(createData(_bookmarkThingAddress, _bookmarkName, _bookmarkSource, _bookmarkType, _bookmarkComment))
            })
            setBookmarkTableRows(_bookmarkTableRows);
        })();
    }, [session, session.info.isLoggedIn, containerUri, tableKey]);

    function createData(thingaddress, name, source, type, comment) {
        return {
            thingaddress,
            name,
            source,
            type,
            comment
        };
    }

    const refreshTable = () => {
        setTableKey(key => key + 1)
    };

    const handleSearch = async (searchText, friends) => {

        //search in wikidata for similar keywords
        var searchKeywords = await wikidataSearch(searchText.toLowerCase());
        console.log(searchKeywords);

        //get bookmarks of friends
        if (selectedFriends && selectedFriends.length > 0) {
            const bookmarksSearchResult = await getBookmarksOfSelectedFriends(searchKeywords);
            setTimeout(() => {
                assigntable(bookmarksSearchResult);
            }, 3000)

        }
        else {
            const bookmarksSearchResult = await getBookmarks(searchKeywords, friends);
            setTimeout(() => {
                assigntable(bookmarksSearchResult);
            }, 3000)
        }
    };

    let assigntable = (bookmarks) => {
        console.log(bookmarks);

        var _bookmarks = [];
        bookmarks.forEach((bm) => {
            const _bookmarkThingAddress = bm.url
            const _bookmarkName = getStringNoLocale(bm, NAME_PREDICATE)
            const _bookmarkType = getStringNoLocale(bm, IDENTIFIER_PREDICATE)
            const _bookmarkSource = getStringNoLocale(bm, URL_PREDICATE)
            const _bookmarkComment = getStringNoLocale(bm, DESCRIPTION_PREDICATE)
            _bookmarks.push(createData(_bookmarkThingAddress, _bookmarkName, _bookmarkSource, _bookmarkType, _bookmarkComment))
        })
        if (_bookmarks.length > 0) {
            setBookmarkTableRows(_bookmarks);
        }

        return _bookmarks;
    }

    let getBookmarksOfSelectedFriends = async (searchKeywords) => {
        var searchResult = [];

        fetcher.load(me);
        console.log('selectedFriends')
        console.log(selectedFriends)

        selectedFriends.push(me.value);
        selectedFriends.forEach(async (friend) => {
            const pod = friend.replace('profile/card#me', '');
            var cont = `${pod}bookmarks`;
            console.log('friend pod url')
            console.log(cont)
            const bookmarks = await getBookmarkList(cont, session.fetch); //friend's bookmark dataset

            if (!bookmarks) { alert(('There is no bookmark in ').concat(pod)) }
            else {
                var _bookmarkTableData = await getThingAll(bookmarks) //friend's bookmarks

                _bookmarkTableData.forEach(async (data) => {
                    console.log('fetched')
                    await fetcher.load(store.sym(data.url));
                    var name = store.each(rdf.sym(store.sym(data.url)), SCHEMA('name'));
                    var description = store.each(rdf.sym(store.sym(data.url)), SCHEM('Description'));

                    if (name && new RegExp(searchKeywords.join("|")).test(name[0].value.toLowerCase())) {
                        searchResult.push(data);
                    }
                    else if (description && new RegExp(searchKeywords.join("|")).test(description[0].value.toLowerCase())) {
                        searchResult.push(data);
                    }
                })
            }
        });

        return searchResult;
    }


    let getBookmarks = async (searchKeywords) => {
        var searchResult = [];

        fetcher.load(me);
        var friends = store.each(rdf.sym(me), FOAF('knows')); //get friends

        friends.push(me)
        friends.forEach(async (friend) => {
            await fetcher.load(friend);

            const podsUrls = await getPodUrlAll(friend.value) //friend's pods
            const pod = podsUrls[0]; //friend's pod
            var cont = `${pod}bookmarks`;
            const bookmarks = await getBookmarkList(cont, session.fetch); //friend's bookmark dataset

            if (!bookmarks) { alert(('There is no bookmark in ').concat(pod)) }
            else {
                var _bookmarkTableData = await getThingAll(bookmarks) //friend's bookmarks
                _bookmarkTableData.forEach(async (data) => {
                    console.log('fetched')
                    await fetcher.load(store.sym(data.url));
                    var name = store.each(rdf.sym(store.sym(data.url)), SCHEMA('name'));
                    var description = store.each(rdf.sym(store.sym(data.url)), SCHEM('Description'));

                    if (name && new RegExp(searchKeywords.join("|")).test(name[0].value.toLowerCase())) {
                        searchResult.push(data);
                    }
                    else if (description && new RegExp(searchKeywords.join("|")).test(description[0].value.toLowerCase())) {
                        searchResult.push(data);
                    }
                })
            }
        });

        return searchResult;
    };

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name',
        },
        {
            id: 'source',
            numeric: true,
            disablePadding: false,
            label: 'Source',
        },
        {
            id: 'type',
            numeric: true,
            disablePadding: false,
            label: 'Type',
        },
    ];

    const restoreCallback = (url) => {
        console.log(`Use this function to navigate back to ${url}`);
    };

    const handleFilterOpen = () => {
        setOpen(true);
    };

    const handleFilterClose = (friends) => {
        setSelectedFriends(friends)
        setOpen(false);
    };

    let navigate = useNavigate();

    const redirectWelcomePage = () => {
        navigate("../");
    }

    const deleteBookmark = async (addresses) => {
        console.log('addresses')
        addresses.forEach(async (thingsaddress) => {
            const updatedBookmarkList = removeThing(bookmarkList, thingsaddress)
            console.log(thingsaddress)
            await saveSolidDatasetAt(containerUri, updatedBookmarkList, {
                fetch: session.fetch,
            });
        })
        console.log('addresses2')
        refreshTable();
    };

    const handleClickOpen = () => {
        setOpenLogout(true);
    };

    const handleClose = () => {
        setOpenLogout(false);
    };

    return (
        <SessionProvider sessionId="session-provider-example"
            onError={console.log}
            restorePreviousSession
            onSessionRestore={restoreCallback}>
            <CombinedDataProvider
                datasetUrl={session.info.webId}
                thingUrl={session.info.webId}
            >
                <Grid container direction="row">
                    <PopupWelcome />
                    <Grid container item direction="column" lg={2} alignItems="flex-start">
                        <img width="100" src={logo} alt="TTA Logo" />
                    </Grid>
                    <Grid container item direction="column" lg={8} alignItems="center">
                        <Grid container spacing={1} justifyContent="center" alignItems="center" id="addmargin" direction="row">
                            <Grid container item direction="column" lg={11} alignItems="center"><SearchBar func={handleSearch} /></Grid>
                            <Grid container item direction="column" lg={1} alignItems="flex-end">
                                <CustomButton onClick={handleFilterOpen}>Filter</CustomButton>
                                <PopupFilter open={open} handleClose={handleFilterClose} fetcher={fetcher} store={store} me={me} />
                            </Grid>
                        </Grid>
                        <Grid container item justifyContent="center" alignItems="center" id="addmargin" direction="row">
                            {bookmarkTableRows &&
                                <CustomTable key={tableKey} rows={bookmarkTableRows} headCells={headCells} deleteBookmark={deleteBookmark} />}
                        </Grid>
                        <Grid container item alignItems="flex-start" id="addmargin" direction="row">
                            <PopupAddBookmark bookmarkList={bookmarkList} containerUri={containerUri} refreshTable={refreshTable} />
                        </Grid>
                    </Grid>
                    <Grid container item direction="column" lg={2} alignItems="flex-end">
                        <IconButton size="medium" onClick={handleClickOpen}>
                            <ExitToAppIcon sx={{ fontSize: 30, color: '#000000' }} />
                        </IconButton>
                        <Dialog
                            open={openLogout}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Oh, are you leaving?"}
                            </DialogTitle>
                            <DialogContent sx={{ minWidth: 400 }}>
                                <DialogContentText id="alert-dialog-description">
                                    Please come back later.
                                    <FavoriteIcon />
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <CustomButton onClick={handleClose} id="addmarginright">
                                    Cancel
                                </CustomButton>
                                <LogoutButton
                                    onError={function noRefCheck() { alert('Error occured.') }}
                                    onLogout={() => redirectWelcomePage()}
                                >
                                    <CustomButton id="addmarginright">
                                        Ok, bye.
                                    </CustomButton>
                                </LogoutButton>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                </Grid>
            </CombinedDataProvider>
        </SessionProvider>
    );
}

export default Home;