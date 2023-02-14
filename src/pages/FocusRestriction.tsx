import { AppBar, Toolbar, IconButton, Typography, Button, ToggleButton as MuiToggleButton, styled } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import { Filter, Food, initialFilters, sampleData } from "../App";


const ToggleButton = styled(MuiToggleButton)(({ selectedcolor }: { selectedcolor: string }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: selectedcolor,
    },
    "&": {
      borderColor: selectedcolor,
      color: selectedcolor,
    }
}));

export const FocusRestriction = () => {
    const [food, setFood] = useState<Food>();
    const [filters, setFilters] = useState<Filter[]>([]);
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

    useEffect(() => {
        const food = sampleData.find((food, index) => index === parseInt(id ?? "-1"));
        setFood(food);
        const filters = [];
        if(food !== undefined) {
            for(const filter of food.filters) {
                const filterObject = initialFilters.find(f => f.name === filter);
                if(filterObject !== undefined) {
                    filters.push(filterObject);
                }
            }
        }
        console.log(filters);
        setFilters(filters);
    }, [id]);

    console.log(food);
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Product detail
                    </Typography>
                </Toolbar>
            </AppBar>

            <h2>{food?.name}</h2>
            <img src={food?.image} alt={food?.name} id="restriction__focus__image"/>
            <p style={{paddingLeft: "30px", paddingRight: "30px"}}>This product is not compatible with some of your restriction(s):</p>
            <div id="filters" style={{justifyContent: "center", marginTop: 0}}>
                {filters.map((filter, id) => (
                    <ToggleButton 
                        key={filter.name}
                        value={filter.name}
                        selected={true}
                        selectedcolor={filter.color}
                        disabled={true}>
                        {filter.name}
                    </ToggleButton>
                ))}
            </div>
            <img src={require("../templates/detail.png")}/>
        </>
    );
};