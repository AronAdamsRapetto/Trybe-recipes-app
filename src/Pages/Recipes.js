import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Header from '../Components/Header';
import RecipeCard from '../Components/RecipeCard';
import RecipesContext from '../Context/recipesContext';
import Footer from '../Components/Footer';
import fetchAPIs from '../services/FetchAPI';
import ButtonFilters from '../Components/ButtonFilters';
import './StyleSheet/Recipes.css';

function Recipes({ history: { location: { pathname } } }) {
  const [recipeType, setRecipeType] = useState('');

  const { recipes, setRecipes, isLoading, setIsLoading } = useContext(RecipesContext);

  useEffect(() => {
    const setInitalRecipes = async () => {
      if (pathname === '/foods') {
        setRecipeType('Foods');
        setIsLoading(true);
        const data = await fetchAPIs('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const responseRecipes = [...Object.values(data)[0]];
        setRecipes(responseRecipes);
        setIsLoading(false);
      }
      if (pathname === '/drinks') {
        setRecipeType('Drinks');
        setIsLoading(true);
        const data = await fetchAPIs('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        const responseRecipes = [...Object.values(data)[0]];
        setRecipes(responseRecipes);
        setIsLoading(false);
      }
    };
    setInitalRecipes();
  }, [pathname, setRecipes, setIsLoading]);

  return (
    <main>
      <Header headerText={ recipeType } isSearchPage />
      <ButtonFilters recipeType={ recipeType } />
      <section className="recipes-container">
        {
          !isLoading ? recipes.map((recipe, index) => (
            <RecipeCard
              key={ index }
              linkTestId={ `${index}-recipe-card` }
              nameTestId={ `${index}-card-name` }
              index={ index }
              recipeId={ recipeType === 'Foods' ? recipe.idMeal : recipe.idDrink }
              recipeImage={ recipeType === 'Foods'
                ? recipe.strMealThumb : recipe.strDrinkThumb }
              recipeName={ recipeType === 'Foods' ? recipe.strMeal : recipe.strDrink }
              recipeType={ recipeType }
            />
          )) : <h1 className="loading-element">Loading...</h1>
        }
      </section>
      <Footer />
    </main>
  );
}

Recipes.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Recipes;
