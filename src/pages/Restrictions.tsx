import {
    Divider,
    Fab,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Tab,
    Tabs,
    ToggleButton as MuiToggleButton,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { Filter, Food, initialFilters, sampleData } from "../App";

export const Restrictions = () => {
    const [tab, setTab] = React.useState(0);
    const navigate = useNavigate();

    return (
        <>
            <h3>Your products</h3>
            <Tabs
                value={tab}
                onChange={(event, newValue) => setTab(newValue)}
                centered
                id='restrictions__header'>
                <Tab label='Compatible' />
                <Tab label='Not compatible' />
            </Tabs>

            <RestrictionContent isCompatible={tab === 0} />

            <Fab
                variant='extended'
                size='medium'
                color='primary'
                aria-label='add'
                id='add__restriction'
                onClick={() => navigate("/restrictions/add")}>
                <AddIcon style={{ marginRight: "10px" }} />
                New restriction
            </Fab>
        </>
    );
};

const ToggleButton = styled(MuiToggleButton)(
    ({ selectedcolor }: { selectedcolor: string }) => ({
        "&.Mui-selected, &.Mui-selected:hover": {
            color: "white",
            backgroundColor: selectedcolor,
        },
        "&": {
            borderColor: selectedcolor,
            color: selectedcolor,
        },
    })
);

const RestrictionFilter = ({
    filters,
    toggleFilter,
    toggleAll,
}: {
    filters: Filter[];
    toggleFilter: (id: number) => void;
    toggleAll: () => void;
}) => {
    const isAllFiltersSelected = filters.every((filter) => filter.selected);

    return (
        <div id='filters'>
            <MuiToggleButton
                value={"Select all"}
                selected={isAllFiltersSelected}
                onClick={toggleAll}>
                <CheckIcon
                    id={isAllFiltersSelected ? "checked" : "not-checked"}
                />
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
                    <CheckIcon
                        id={filter.selected ? "checked" : "not-checked"}
                    />
                    {filter.name}
                </ToggleButton>
            ))}
        </div>
    );
};

const RestrictionsList = ({
    foods,
    filters,
}: {
    foods: Food[];
    filters: Filter[];
}) => {
    const navigate = useNavigate();

    if (foods.length === 0) {
        return (
            <span
                style={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                }}>
                No ingredients found with your restrictions !
            </span>
        );
    }
    return (
        <List style={{ paddingBottom: "70px" }}>
            {foods.map((food, id) => {
                return (
                    <span key={food.name + " " + id}>
                        <ListItem>
                            <ListItemButton
                                onClick={() =>
                                    navigate("/restrictions/focus/" + id)
                                }>
                                <ListItemIcon>
                                    <img
                                        src={food.image}
                                        alt={food.name}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "contain",
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={food.name} />
                                {food.filters.map((filter) => (
                                    <PlayArrowIcon
                                        key={filter}
                                        style={{
                                            transform: "rotate(-90deg)",
                                            color:
                                                filters.find(
                                                    (f) => f.name === filter
                                                )?.color ?? "white",
                                        }}
                                    />
                                ))}
                            </ListItemButton>
                        </ListItem>
                        <Divider variant='middle' />
                    </span>
                );
            })}
        </List>
    );
};

const RestrictionContent = ({ isCompatible }: { isCompatible: boolean }) => {
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
        const isAllFiltersSelected = filters.every((filter) => filter.selected);
        const newFilters = filters.map((filter) => {
            return {
                ...filter,
                selected: !isAllFiltersSelected,
            };
        });
        setFilters(newFilters);

        refreshFoods(newFilters);
    };

    const refreshFoods = (filters: Filter[]) => {
        if (isCompatible) {
            const filteredFoods = sampleData.filter((food) => {
                return food.filters.every((filter) =>
                    filters.some((f) => f.name === filter && f.selected)
                );
            });
            setFoods(filteredFoods);
        } else {
            const filteredFoods = sampleData.filter((food) => {
                return food.filters.every((filter) =>
                    filters.some((f) => f.name === filter && !f.selected)
                );
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
            <RestrictionFilter
                filters={filters}
                toggleFilter={toggleFilter}
                toggleAll={toggleAll}
            />
            <RestrictionsList foods={foods} filters={filters} />
        </div>
    );
};
