import React, { useCallback, useContext, useEffect } from 'react';
import { Card, Container, Stack } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppProvider';
import Categories from '../components/Categories';
import cleanDataAttributes from '../helper/cleanDataAttributes';

function Recipes() {
  const { fetchData, searchData, setSearchData } = useContext(AppContext);
  const location = useLocation();
  const history = useHistory();

  const pageName = useCallback(() => {
    switch (location.pathname) {
    case '/meals':
      return 'meal';
    default: // /drinks
      return 'cocktail';
    }
  }, [location.pathname]);

  useEffect(() => {
    async function setDefaultRecipes() {
      const data = await fetchData(pageName(), 'name', '');
      const path = location.pathname.replace('/', '');
      const cleanData = cleanDataAttributes(data, path);
      setSearchData(cleanData[path]);
    }
    setDefaultRecipes();
  }, [location.pathname, pageName, setSearchData]);

  const recipeCard = useCallback(({ index, str: title, thumb: img, id, idMeal }) => (
    <Card
      key={ index }
      data-testid={ `${index}-recipe-card` }
      bg="light"
      text="dark"
      onClick={ () => { history.push(`${idMeal ? 'meal' : 'drink'}s/${id}`); } }
    >
      <Card.Img
        variant="top"
        data-testid={ `${index}-card-img` }
        src={ img }
      />
      <Card.Body>
        <Card.Title
          data-testid={ `${index}-card-name` }
        >
          { title }
        </Card.Title>
      </Card.Body>
    </Card>
  ), [history]);

  const recipeListLength = 12;

  const recipeList = useCallback(() => (
    searchData.slice(0, recipeListLength).map(({ str, thumb, id, idMeal }, index) => (
      recipeCard({ index, str, thumb, id, idMeal })
    ))
  ), [searchData, recipeCard]);

  return (
    <>
      <Categories />
      <Container className="pb-5 mb-4">
        <h1 className="mb-3">Recipes</h1>
        <Stack
          direction="vertical"
          gap={ 3 }
        >
          { recipeList() }
        </Stack>
      </Container>
    </>
  );
}

export default Recipes;
