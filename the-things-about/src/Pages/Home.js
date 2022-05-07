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
    getStringNoLocale
} from "@inrupt/solid-client";
import { getOrCreateBookmarkList } from '../Functions';

const NAME_PREDICATE = "http://schema.org/name";
const DESCRIPTION_PREDICATE = "https://schema.org/Description";
const URL_PREDICATE = "https://schema.org/url";
const IDENTIFIER_PREDICATE = "https://schema.org/identifier";

function Home() {
    const { session } = useSession();
    const [bookmarkList, setBookmarkList] = useState();
    const [bookmarkTableRows, setBookmarkTableRows] = useState([]);
    const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage";
    const [containerUri, setContainerUri] = useState();

    useEffect(() => {
        if (!session || !session.info.isLoggedIn) return;

        (async () => {
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
                const _bookmarkName = getStringNoLocale(bm, NAME_PREDICATE)
                const _bookmarkType = getStringNoLocale(bm, IDENTIFIER_PREDICATE)
                const _bookmarkSource = getStringNoLocale(bm, URL_PREDICATE)
                const _bookmarkComment = getStringNoLocale(bm, DESCRIPTION_PREDICATE)
                _bookmarkTableRows = _bookmarkTableRows.concat(createData(_bookmarkName, _bookmarkSource, _bookmarkType, _bookmarkComment))
            })

            setBookmarkTableRows(_bookmarkTableRows);
        })();
    }, [session, session.info.isLoggedIn, containerUri]);

    function createData(name, source, type, comment) {
        return {
            name,
            source,
            type,
            comment
        };
    }

    const handleSearch = (searchText) => {
        alert(searchText);
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

    return (
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
                            <CustomTable rows={bookmarkTableRows} headCells={headCells} />}
                    </Grid>
                    <Grid container item alignItems="flex-start" id="addmargin" direction="row">
                        <PopupAddBookmark bookmarkList={bookmarkList} setBookmarkList={setBookmarkList} containerUri={containerUri} />
                    </Grid>
                </Grid>
                <Grid container item direction="column" lg={2} alignItems="flex-end">
                    <IconButton size="medium" onClick={() => alert("you will see settings soon.")}>
                        <SettingsIcon sx={{ fontSize: 40, color: '#000000' }} />
                    </IconButton>
                </Grid>
            </Grid>
        </CombinedDataProvider>
    );
}

export default Home;