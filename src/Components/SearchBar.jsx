import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import RecipesContext from '../Context/recipesContext';
import fetchAPIs from '../services/FetchAPI';

function SearchBar({ recipeType }) {
  const [inputSearch, setInputSearch] = useState({
    textValue: '',
    searchType: '',
  });

  const { setRecipes } = useContext(RecipesContext);

  const history = useHistory();

  const inputSearchChanges = ({ target: { name, value } }) => {
    setInputSearch((oldState) => ({
      ...oldState,
      [name]: value }));
  };

  const redirectIfOneRecipe = (data) => {
    const pathname = recipeType === 'Foods'
      ? `/foods/${data[0].idMeal}`
      : `/drinks/${data[0].idDrink}`;
    console.log(pathname);
    if (data.length === 1) {
      history.push(pathname);
    }
  };

  const verifyApiReturn = (returnedApi) => {
    const initMessage = 'Sorry, we haven';
    const completeMessage = `${initMessage}'t found any recipes for these filters.`;
    const value = Object.values(returnedApi)[0];
    if (value === null) {
      global.alert(completeMessage);
      return true;
    }
  };

  const getRecipes = async (url) => {
    const response = await fetchAPIs(url);
    const isEmpty = verifyApiReturn(response);
    if (!isEmpty) {
      const recipes = [...Object.values(response)[0]];
      setRecipes(recipes);
      redirectIfOneRecipe(recipes);
    }
  };

  const configUrl = () => {
    const urlFormat = recipeType === 'Foods' ? 'https://www.themealdb.com/api/json/v1/1/' : 'https://www.thecocktaildb.com/api/json/v1/1/';
    const { textValue, searchType } = inputSearch;
    if (searchType === 'i=') {
      return `${urlFormat}filter.php?${searchType}${textValue}`;
    }
    if (searchType !== 'i=') {
      return `${urlFormat}search.php?${searchType}${textValue}`;
    }
  };

  const searchButtonClick = () => {
    const url = configUrl();
    const { textValue, searchType } = inputSearch;

    if (searchType === 'f=' && textValue.length > 1) {
      global.alert('Your search must have only 1 (one) character');
    } else {
      getRecipes(url);
    }
  };

  return (
    <form>
      <input
        type="text"
        id="input-search"
        name="textValue"
        value={ inputSearch.textValue }
        onChange={ inputSearchChanges }
        data-testid="search-input"
      />
      <label htmlFor="ingredient">
        <input
          type="radio"
          id="ingredient"
          name="searchType"
          value="i="
          onChange={ inputSearchChanges }
          data-testid="ingredient-search-radio"
        />
        Ingredient
      </label>
      <label htmlFor="name">
        <input
          type="radio"
          id="name"
          name="searchType"
          value="s="
          onChange={ inputSearchChanges }
          data-testid="name-search-radio"
        />
        Name
      </label>
      <label htmlFor="firstLetter">
        <input
          type="radio"
          id="firstLetter"
          name="searchType"
          value="f="
          onChange={ inputSearchChanges }
          data-testid="first-letter-search-radio"
        />
        First letter
      </label>
      <button
        type="button"
        data-testid="exec-search-btn"
        onClick={ searchButtonClick }
      >
        SEARCH
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  recipeType: PropTypes.string.isRequired,
};

export default SearchBar;