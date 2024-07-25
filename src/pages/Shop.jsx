import React from 'react';
import CommonSection from '../components/Ui/CommonSection';
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/shop.css';
import products from '../assets/data/products';
import { useState } from 'react';
import ProductsList from '../components/Ui/ProductsList';

function Shop() {

  const [productsData, setProductsData] = useState(products);

  const handleFilter = e => {
    const filterValue = e.target.value;

    if (filterValue === 'sofa') {
      const fileredProducts = products.filter((item) => item.category === 'sofa');

      setProductsData(fileredProducts);
    }

    if (filterValue === 'mobile') {
      const fileredProducts = products.filter((item) => item.category === 'mobile');

      setProductsData(fileredProducts);
    }

    if (filterValue === 'chair') {
      const fileredProducts = products.filter((item) => item.category === 'chair');

      setProductsData(fileredProducts);
    }

    if (filterValue === 'watch') {
      const fileredProducts = products.filter((item) => item.category === 'watch');

      setProductsData(fileredProducts);
    }

    if (filterValue === 'wireless') {
      const fileredProducts = products.filter((item) => item.category === 'wireless');

      setProductsData(fileredProducts);
    }

    
  };

  const handleSearch = e => {
    const searchTerm = e.target.value;

    const searchedProducts = products.filter(item =>
      item.productName.toLocaleLowerCase().includes(searchTerm.toLowerCase()));
    
    setProductsData(searchedProducts);
  }

  return (
    <Helmet title='Shop'>
      <CommonSection title='Products' />
      

      <section>
        <Container>
          <Row>
            <Col lg='3' md='6'>
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option>Filter By Category</option>
                  <option value="sofa">Sofa</option>
                  <option value="mobile">Mobile</option>
                  <option value="chair">Chair</option>
                  <option value="watch">Watch</option>
                  <option value="wireless">Wireless</option>
                </select>
              </div>
            </Col>
            <Col lg='3' md='6' className='text-end'>
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option>Sort By</option>
                  <option value="mobile">Ascending</option>
                  <option value="watch">Descending</option>
                </select>
              </div>
            </Col>

            <Col lg='6' md='12'>
              <div className="search__box">
                <input type="text" placeholder='Search.....'  onChange={handleSearch}/>
                <span><i className="ri-search-line"></i></span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className='pt-0'>
        <Container>
          <Row>
            {productsData.length === 0 ? (<h1 className='text-center fs-4'>No Products are found!</h1>) :
            (<ProductsList data={productsData}/>)}
          </Row>
        </Container>
      </section>

    </Helmet>
  )
}

export default Shop; 