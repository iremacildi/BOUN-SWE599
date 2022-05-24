import { useEffect, useState } from 'react'
import { Grid, IconButton } from '@mui/material';
import logo from '../img/TTAlogo.png'
import CustomButton from '../Components/CustomButton';
import CustomTable from '../Components/CustomTable';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchBar from '../Components/SearchBar';
import PopupAddBookmark from './PopupAddBookmark';
import { useSession, CombinedDataProvider } from "@inrupt/solid-ui-react";
import PopupWelcome from './PopupWelcome';
import {
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
    getStringNoLocale,
    getProfileAll,
    getPodUrlAll
} from "@inrupt/solid-client";
import { getOrCreateBookmarkList, friends, runQuery } from '../Functions';
import { SessionProvider } from "@inrupt/solid-ui-react";
const rdf = require('rdflib');

const NAME_PREDICATE = "http://schema.org/name";
const SCHEMA = new rdf.Namespace("http://schema.org/");
const DESCRIPTION_PREDICATE = "https://schema.org/Description";
const URL_PREDICATE = "https://schema.org/url";
const IDENTIFIER_PREDICATE = "https://schema.org/identifier";
const VCARD = new rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const FOAF = new rdf.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = new rdf.Namespace('http://www.w3.org/ns/ldp#');
const RDF = new rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const BOOKMARKS = new rdf.Namespace('/bookmarks#');

function Home() {
    const { session } = useSession();
    const [bookmarkList, setBookmarkList] = useState();
    const [bookmarkTableRows, setBookmarkTableRows] = useState([]);
    const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage";
    const [containerUri, setContainerUri] = useState();
    const [tableKey, setTableKey] = useState(0);
    const [me, setMe] = useState();
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    useEffect(() => {
        if (!session || !session.info.isLoggedIn) return;

        (async () => {
            setMe(store.sym(session.info.webId));
            window.solidFetcher = session.clientAuthentication.fetch;
            // console.log('-----------')

            const profileDataset = await getSolidDataset(session.info.webId, {
                fetch: session.fetch,
            });
            // console.log('profileDataset')
            // console.log(profileDataset)
            const profileThing = getThing(profileDataset, session.info.webId);
            // console.log('profileThing')
            // console.log(profileThing)
            const podsUrls = getUrlAll(profileThing, STORAGE_PREDICATE);
            console.log('podsUrls')
            console.log(podsUrls)
            const pod = podsUrls[0];
            ///////////////////////////////////////
            setContainerUri(`${pod}bookmarks`);
            const list = await getOrCreateBookmarkList(containerUri, session.fetch);
            setBookmarkList(list);
            setMe(store.sym(session.info.webId));
            window.solidFetcher = session.clientAuthentication.fetch;
            const _bookmarkTableData = getThingAll(list)
            ///////////////////////////////////////
            // setContainerUri(`${pod}bookmarkss`);
            // const bookmarkDataset = await getOrCreateBookmarkList(containerUri, session.fetch);
            // setBookmarkList('bookmarkDataset');
            // setBookmarkList(bookmarkDataset);
            // console.log('session.info.webId')
            // console.log(session.info.webId)
            // console.log('containerUri')
            // console.log(containerUri)
            // const bookmarkThing = getThing(bookmarkDataset, containerUri);
            // console.log('bookmarkThing')
            // console.log(bookmarkThing)

            // const _bookmarkTableData = bookmarkThing
            ///////////////////////////////////////
            var _bookmarkTableRows = [];

            _bookmarkTableData.map((bm) => {
                const _bookmarkName = getStringNoLocale(bm, NAME_PREDICATE)
                const _bookmarkType = getStringNoLocale(bm, IDENTIFIER_PREDICATE)
                const _bookmarkSource = getStringNoLocale(bm, URL_PREDICATE)
                const _bookmarkComment = getStringNoLocale(bm, DESCRIPTION_PREDICATE)
                _bookmarkTableRows = _bookmarkTableRows.concat(createData(_bookmarkName, _bookmarkSource, _bookmarkType, _bookmarkComment))
            })

            setBookmarkTableRows(_bookmarkTableRows);
        })();
    }, [session, session.info.isLoggedIn, containerUri, tableKey]);

    function createData(name, source, type, comment) {
        return {
            name,
            source,
            type,
            comment
        };
    }

    const refreshTable = () => {
        setTableKey(key => key + 1)
    };

    const handleSearch = async (searchText) => {
        // const profileDataset = getSolidDataset("https://volkandemir.solidcommunity.net/profile/card#me", {
        //     fetch: session.fetch,
        // });
        // // console.log('profileDataset')
        // // console.log(profileDataset)
        // const profileThing = getThing(profileDataset, "https://volkandemir.solidcommunity.net/profile/card#me");
        // console.log('profileThing')
        // console.log(profileThing)

        const podsUrls = await getPodUrlAll("https://volkandemir.solidcommunity.net/profile/card#me")
        // console.log('profileThing')
        // console.log(profileThing)
        // const podsUrls = getUrlAll(profileThing.webIdProfile, STORAGE_PREDICATE);
        // console.log('podsUrls')
        console.log(podsUrls)
        const pod = podsUrls[0];
        ///////////////////////////////////////
        var cont = `${pod}bookmarks`;
        const listt = getOrCreateBookmarkList(cont, session.fetch);

        const _bookmarkTableData = getThingAll(listt)
        console.log('qqqqqqqqqqqqqqqqqqqqqq')

        // console.log(session)
        // console.log(session.clientAuthentication)
        const profile = me.doc();
        console.log(me)
        console.log(profile)
        // let friends = [];
        // console.log(fetcher)

        // var indexOf = session.info.webId.indexOf('#');
        // var docURI = session.info.webId.slice(0, indexOf)
        // fetcher.nowOrWhenFetched(docURI, undefined, function (ok, body) {
        //     friends(me, store);
        // });

        // fetcher.load(profile).then(resp => {
        //     store.each(me, FOAF('knows')).forEach(friend => friends.push(friend));
        // });

        // console.log(friends)

        // let folder = rdf.sym('https://iremacildi.solidcommunity.net/movies/');

        const person = session.info.webId;
        console.log(session.info.webId)
        fetcher.load(person);
        const friends = store.each(rdf.sym(person), FOAF('knows'));

        friends.forEach(async (friend) => {
            await fetcher.load(friend);
            const fullName = store.any(friend, FOAF('name'));
            console.log(friend)
            console.log(fullName.value)
        });

        // const testbookmark = 'https://iremacildi.solidcommunity.net/bookmarks#test';
        const testbookmark = 'https://iremacildi.solidcommunity.net/bookmarks';
        console.log(testbookmark)
        fetcher.load(testbookmark);
        const names = store.each(rdf.sym(testbookmark), '#test');
        console.log(names)

        // fetcher.load(folder).then((res) => {
        //     console.log(res)
        //     store.each(folder, LDP('contains')).forEach(file => {
        //         // var b = file.doc()
        //         console.log(file)
        //     })
        // });

        // alert(searchText);
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
                            <Grid container item direction="column" lg={1} alignItems="flex-end"><CustomButton onClick={() => alert("you will see filter soon.")}>Filter</CustomButton></Grid>
                        </Grid>
                        <Grid container item justifyContent="center" alignItems="center" id="addmargin" direction="row">
                            {bookmarkTableRows &&
                                <CustomTable key={tableKey} rows={bookmarkTableRows} headCells={headCells} />}
                        </Grid>
                        <Grid container item alignItems="flex-start" id="addmargin" direction="row">
                            <PopupAddBookmark bookmarkList={bookmarkList} setBookmarkList={setBookmarkList} containerUri={containerUri} refreshTable={refreshTable} />
                        </Grid>
                    </Grid>
                    <Grid container item direction="column" lg={2} alignItems="flex-end">
                        <IconButton size="medium" onClick={() => alert("you will see settings soon.")}>
                            <SettingsIcon sx={{ fontSize: 40, color: '#000000' }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </CombinedDataProvider>
        </SessionProvider>
    );
}

export default Home;