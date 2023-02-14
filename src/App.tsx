import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import { Restrictions } from './pages/Restrictions';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import KitchenIcon from '@mui/icons-material/Kitchen';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { Route, RouteProps, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ARScan } from './pages/ARScan';
import { Fridge } from './pages/Fridge';

const routes: RouteProps[] = [
    {
        path: "/ar-scan",
        element: <ARScan/>,
    },
    {
        path: "/fridge",
        element: <Fridge/>,
    },
    {
        path: "/restrictions",
        element: <Restrictions/>,
    },
];

function App() {


    return (
        <div id="app">
            <header>
            </header>
            <div id="page">
                <Routes>
                    {routes.map((route, id) => (<Route key={id} {...route} />))}
                </Routes>
            </div>
            <Navigations />
        </div>
    );
}

export default App;

const Navigations = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const {pathname} = useLocation();

    useEffect(() => {
        switch (pathname) {
            case "/ar-scan":
                setValue(0);
                break;
            case "/fridge":
                setValue(1);
                break;
            case "/restrictions":
                setValue(2);
                break;
        }
    }, [pathname]);

    return (
        <footer>
            <BottomNavigation
                id='bottom-nav'
                style={{backgroundColor: "#f3edf7"}}
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    switch (newValue) {
                        case 0:
                            navigate("/ar-scan");
                            break;
                        case 1:
                            navigate("/fridge");
                            break;
                        case 2:
                            navigate("/restrictions");
                            break;
                    }
                }}>
                <BottomNavigationAction label="AR scan" icon={<QrCode2Icon />} style={{color: "black"}} />
                <BottomNavigationAction label="Fridge" icon={<KitchenIcon />} style={{color: "black"}} />
                <BottomNavigationAction label="Restrictions" icon={<FindInPageIcon />} style={{color: "black"}} />
            </BottomNavigation>
        </footer>
    );
}