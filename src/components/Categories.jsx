import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppProvider';
import cleanDataAttributes from '../helper/cleanDataAttributes';

export default function Categories() {
  const { fetchCategories, fetchData, setSearchData } = useContext(AppContext);
  const [categoriesList, setCategories] = useState([]);
  const location = useLocation();
  const [selectedCategory, setCategory] = useState('');

  const pageName = useCallback(() => {
    switch (location.pathname) {
    case '/drinks':
      return 'cocktail';
    default:
      return 'meal';
    }
  }, [location.pathname]);

  const onClickHandler = useCallback(async ({ target: { value } }) => {
    let strCategory = value;
    let data;
    if (strCategory === 'All' || strCategory === selectedCategory) {
      strCategory = 'All';
      data = await fetchData(pageName(), 'name', '');
    } else {
      data = await fetchData(pageName(), 'category', strCategory);
    }
    const path = location.pathname.replace('/', '');
    const cleanData = cleanDataAttributes(data, path);
    setSearchData(cleanData[path]);
    setCategory(strCategory);
  }, [pageName, selectedCategory]);

  useEffect(() => {
    const setCategoriesList = async () => {
      const categories = await fetchCategories(pageName());
      const path = location.pathname.replace('/', '');
      if (!categories[path]) return;
      const FIVE = 6;
      const categoriesNew = [...categories[path]];
      categoriesNew.splice(0, 0, { strCategory: 'All' });
      setCategories(categoriesNew.slice(0, FIVE));
    };
    setCategoriesList();
  }, [fetchCategories, pageName, location]);

  return (
    <Container className="text-center">
      {/* <Stack direction="horizontal" className="col-md-4 mx-auto"> */}
      <ButtonGroup
        size="sm"
        className="mb-3"
      >
        {
          categoriesList.map(({ strCategory }) => (
            <Button
              key={ `cat-${strCategory}` }
              variant="outline-dark"
              data-testid={ `${strCategory}-category-filter` }
              className="small-text"
              onClick={ (event) => { onClickHandler(event); } }
              value={ strCategory }
            >
              {strCategory}
            </Button>
          ))
        }
      </ButtonGroup>

      {/* </Stack> */}
    </Container>
  );
}
