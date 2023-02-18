import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    TextField,
    Switch,
    FormGroup,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { Filter, Food, initialFilters, sampleData } from "../App";
import { MuiColorInput } from "mui-color-input";
import { useState } from "react";

export const AddRestriction = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [color, setColor] = useState("#000000");
    const [ingredients, setIngredients] = useState<Food[]>([]);
    const [automatic, setAutomatic] = useState(true);

    const changeColor = (value: string) => {
        setColor(value);
    };

    function addIngredient(event: any) {
        const foodName = event.target.value;
        if (foodName === "") return;
        const food = sampleData.find((food) => food.name === foodName);
        if (food === undefined) return;
        if (
            ingredients.find((ingredient) => ingredient.name === food.name) !==
            undefined
        )
            return;
        setIngredients([...ingredients, food]);
    }

    function removeIngredient(id: number) {
        const newIngredients = ingredients.filter((_, index) => index !== id);
        setIngredients(newIngredients);
    }

    const submit = () => {
        if (name === "") {
            window.location.href = "/restrictions";
            return;
        }
        console.log("submit", name, color, ingredients, automatic);
        const groupsString = localStorage.getItem("filterGroups");
        let groups: Filter[] =
            groupsString !== null ? JSON.parse(groupsString) : initialFilters;
        groups = groups.filter((group) => group.name !== name);
        groups?.push({
            name: name,
            color: color,
            selected: true,
        });
        localStorage.setItem("filterGroups", JSON.stringify(groups));

        const foodsString = localStorage.getItem("foods");
        let foods: Food[] =
            foodsString !== null ? JSON.parse(foodsString) : sampleData;
        for (const food of foods) {
            food.filters = food.filters.filter((filter) => filter !== name);
            if (
                ingredients.find(
                    (ingredient) => ingredient.name === food.name
                ) !== undefined
            ) {
                food.filters.push(name);
            }
        }
        localStorage.setItem("foods", JSON.stringify(foods));
        window.location.href = "/restrictions";
    };

    function loadFilter(filterName: string) {
        const filter = initialFilters.find(
            (filter) => filter.name === filterName
        );
        if (filter === undefined) return;
        setName(filter.name);
        setColor(filter.color);
        setIngredients(
            sampleData.filter((food) => food.filters.includes(filter.name))
        );
    }

    return (
        <>
            <AppBar position='fixed'>
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{ mr: 2 }}
                        onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        variant='h6'
                        component='div'
                        sx={{ flexGrow: 1 }}>
                        Create group
                    </Typography>
                </Toolbar>
            </AppBar>

            <FormGroup
                style={{ padding: "20px", gap: "30px", paddingTop: "90px" }}>
                <FormControl fullWidth>
                    <Autocomplete
                        id='free-solo-demo'
                        freeSolo
                        color='secondary'
                        options={initialFilters.map((filter) => filter.name)}
                        onChange={(event, value) => loadFilter(value ?? "")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Group name'
                                color='secondary'
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                            />
                        )}
                    />
                </FormControl>

                <MuiColorInput
                    color='secondary'
                    label='Group color'
                    value={color}
                    onChange={changeColor}
                />

                <FormControl fullWidth>
                    <InputLabel color='secondary' id='ingredient-label'>
                        Pick an ingredient to exclude from your diet:
                    </InputLabel>
                    <Select
                        color='secondary'
                        value={""}
                        labelId='ingredient-label'
                        label='Pick an ingredient to exclude from your diet:'
                        onChange={addIngredient}>
                        {getUniqueFoods(sampleData).map((food, id) => {
                            return (
                                <MenuItem
                                    key={food.name + " " + id}
                                    value={food.name}>
                                    {food.name}
                                </MenuItem>
                            );
                        })}
                    </Select>

                    <List style={{ padding: 0 }}>
                        {getUniqueFoods(ingredients).map((food, id) => {
                            return (
                                <span key={food.name + " " + id}>
                                    <ListItem>
                                        <ListItemButton
                                            onClick={() =>
                                                removeIngredient(id)
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
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider variant='middle' />
                                </span>
                            );
                        })}
                    </List>
                </FormControl>

                <FormControlLabel
                    control={
                        <Switch
                            defaultChecked
                            color='secondary'
                            onChange={(event) =>
                                setAutomatic(event.target.checked)
                            }
                        />
                    }
                    label={
                        <span style={{ fontSize: "12px" }}>
                            Automatically add food with these ingredient to this
                            group (if disabled you will have to manually add
                            your food to this group)
                        </span>
                    }
                />

                <div id='form__button'>
                    <Button
                        variant='contained'
                        color='secondary'
                        id='form__button__cancel'
                        onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        color='secondary'
                        id='form__button__create'
                        onClick={() => submit()}>
                        Create group
                    </Button>
                </div>
            </FormGroup>
        </>
    );
};

// remove duplicate foods
function getUniqueFoods(foods: Food[]) {
    const uniqueFoods: Food[] = [];
    for (const food of foods) {
        if (
            uniqueFoods.find((uniqueFood) => uniqueFood.name === food.name) ===
            undefined
        )
            uniqueFoods.push(food);
    }
    return uniqueFoods;
}
