import { Fab, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Tab, Tabs, ToggleButton as MuiToggleButton } from '@mui/material';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

type Filter = {
    name: string;
    selected: boolean;
    color: string;
}

const initialFilters: Filter[] = [
    {
        name: "Vegan",
        selected: true,
        color: "green",
    },
    {
        name: "Nut-based allergens",
        selected: true,
        color: "blue",
    },
    {
        name: "Gluten",
        selected: true,
        color: "red",
    }
];

type Food = {
    name: string;
    image: string;
    filters: string[];
}

const sampleData: Food[] = [
    {
        name: "Banana",
        image: "https://media.istockphoto.com/id/1400057530/photo/bananas-isolated.jpg?b=1&s=170667a&w=0&k=20&c=uiSdjIQkTr7S4gEdW_oB_5zfFYhpfe0LP-CryQl49w4=",
        filters: ["Vegan", "Gluten"],
    },
    {
        name: "Peanut butter",
        image: "https://m.media-amazon.com/images/I/71qnBT8dLhL._AC_SL1500_.jpg",
        filters: ["Nut-based allergens"],
    },
    {
        name: "Bread",
        image: "https://www.thespruceeats.com/thmb/vbc6MqkqHlkSOx_X5Clyo5qv0kk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/loaf-of-bread-182835505-58a7008c5f9b58a3c91c9a14.jpg",
        filters: ["Gluten"],
    },
    {
        name: "Milk",
        image: "https://ml4l5wfimak6.i.optimole.com/7Bumah0-lRukPLKd/w:auto/h:auto/q:auto/http://sapinsdairy.com/wp-content/uploads/2021/12/milk-bottle.png",
        filters: ["Vegan"],
    },
    {
        name: "Eggs",
        image: "https://kidseatincolor.com/wp-content/uploads/2022/02/eggs-e1648216369366.jpeg",
        filters: ["Vegan"],
    },
    {
        name: "Chicken",
        image: "https://static01.nyt.com/images/2018/11/01/blogs/01cenicola-1/01cenicola-1-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
        filters: ["Vegan"],
    },
    {
        name: "Pork",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJMSf3RI_En5mT463hzlZgYG4BYcWK9SrT_WO08OCXFoCb8xgl4mtUeaT2oP04omXmvYE&usqp=CAU",
        filters: ["Vegan"],
    },
    {
        name: "Beef",
        image: "data:image/jpeg;base64,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",
        filters: ["Vegan"],
    }
];

export const Restrictions = () => {

    const [tab, setTab] = React.useState(0);

    return (
        <>
            <h3>Your products</h3>
            <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)} centered id="restrictions__header">
                <Tab label="Compatible" />
                <Tab label="Not compatible" />
            </Tabs>

            <RestrictionContent isCompatible={tab === 0}/>
            
            <Fab variant="extended" size="medium" color="primary" aria-label="add" id="add__restriction">
                <AddIcon style={{marginRight: "10px"}}/>
                New restriction
            </Fab>
        </>
    );
};

const ToggleButton = styled(MuiToggleButton)(({ selectedcolor }: { selectedcolor: string }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: selectedcolor,
    },
}));

const RestrictionFilter = ({filters, toggleFilter, toggleAll}: {filters: Filter[], toggleFilter: (id: number) => void, toggleAll: () => void}) => {

    const isAllFiltersSelected = filters.every(filter => filter.selected);

    return (
        <div id="filters">
            <MuiToggleButton 
                value={"Select all"}
                selected={isAllFiltersSelected}
                onClick={toggleAll}>
                <CheckIcon id={isAllFiltersSelected ? "checked" : "not-checked"}/>
                Select all
            </MuiToggleButton>
            {filters.map((filter, id) => (
                <ToggleButton 
                    key={filter.name}
                    value={filter.name}
                    onClick={() => {
                        toggleFilter(id);
                    }}
                    selected={filter.selected}
                    selectedcolor={filter.color}>
                    <CheckIcon id={filter.selected ? "checked" : "not-checked"}/>
                    {filter.name}
                </ToggleButton>
            ))}
        </div>
    );
}

const RestrictionsList = ({foods, filters}: {foods: Food[], filters: Filter[]}) => {

    return (
        <List style={{paddingBottom: "70px"}}>
            {foods.map(food => {
                return (
                    <ListItem key={food.name}>
                        <ListItemButton>
                            <ListItemIcon>
                                <img src={food.image} alt={food.name} style={{width: "50px", height: "50px", objectFit: "contain"}}/>
                            </ListItemIcon>
                            <ListItemText primary={food.name} />
                            {food.filters.map(filter => (
                                <PlayArrowIcon key={filter} style={{ transform: "rotate(-90deg)", color: filters.find(f => f.name === filter)?.color ?? "white" }}/>
                            ))}
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

const RestrictionContent = ({isCompatible}: {isCompatible: boolean}) => {
    const [filters, setFilters] = useState<Filter[]>(initialFilters);
    const [foods, setFoods] = useState<Food[]>(sampleData);

    const toggleFilter = (id: number) => {
        const newFilters = filters.map((filter, index) => {
            if (index === id) {
                return {
                    ...filter,
                    selected: !filter.selected,
                };
            }
            return filter;
        });
        setFilters(newFilters);

        refreshFoods(newFilters);
    };

    const toggleAll = () => {
        const isAllFiltersSelected = filters.every(filter => filter.selected);
        const newFilters = filters.map(filter => {
            return {
                ...filter,
                selected: !isAllFiltersSelected,
            };
        });
        setFilters(newFilters);

        refreshFoods(newFilters);
    };

    const refreshFoods = (filters: Filter[]) => {
        
        if(isCompatible) {
            const filteredFoods = sampleData.filter(food => {
                return food.filters.every(filter => filters.some(f => f.name === filter && f.selected));
            });
            setFoods(filteredFoods);
        } else {
            const filteredFoods = sampleData.filter(food => {
                return food.filters.every(filter => filters.some(f => f.name === filter && !f.selected));
            });
            setFoods(filteredFoods);
        }
    };

    React.useEffect(() => {
        refreshFoods(filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCompatible]);

    return (
        <div>
            <RestrictionFilter filters={filters} toggleFilter={toggleFilter} toggleAll={toggleAll}/>
            <RestrictionsList foods={foods} filters={filters}/>
        </div>
    );
}