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
    getUrlAll
} from "@inrupt/solid-client";
import { getOrCreateBookmarkList } from '../Functions';

function Home() {
    const { session } = useSession();
    const [bookmarkList, setBookmarkList] = useState();
    const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage";
    const [containerUri, setContainerUri] = useState("");

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
        })();
    }, [session, session.info.isLoggedIn, containerUri]);

    function createData(name, source, type) {
        return {
            name,
            source,
            type,
            history: [
                {
                    date: "2020-01-05",
                    customerId: "11091700",
                    amount: 3
                },
                {
                    date: "2020-01-02",
                    customerId: "Anonymous",
                    amount: 1
                }
            ]
        };
    }

    const rows = [
        createData('Cupcake', 305, 3.7),
        createData('Donut', 452, 25.0),
        createData('Eclair', 262, 16.0),
        createData('Frozen yoghurt', 159, 6.0),
        createData('Gingerbread', 356, 16.0),
        createData('Honeycomb', 408, 3.2),
        createData('Ice cream sandwich', 237, 9.0),
        createData('Jelly Bean', 375, 0.0),
        createData('KitKat', 518, 26.0),
        createData('Lollipop', 392, 0.2),
        createData('Marshmallow', 318, 0),
        createData('Nougat', 360, 19.0),
        createData('Oreo', 437, 18.0),
    ];

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
                        <CustomTable rows={rows} headCells={headCells} />
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