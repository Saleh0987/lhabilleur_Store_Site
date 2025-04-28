import React, {useState} from "react";
import CommonSection from "../components/Ui/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import {Container, Row, Col} from "react-bootstrap";
import "../styles/shop.css";
import products from "../assets/data/products";
import ProductsList from "../components/Ui/ProductsList";

function Shop() {
  const [productsData, setProductsData] = useState(products);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Handle category filter
  const handleFilter = (e) => {
    const filterValue = e.target.value;
    setFilterCategory(filterValue);

    let filteredProducts = products;
    if (filterValue !== "") {
      filteredProducts = products.filter(
        (item) => item.category === filterValue
      );
    }

    // Apply search term if present
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setProductsData(filteredProducts);
  };

  // Handle price sorting and reset filter
  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortOrder(sortValue);

    let sortedProducts = [...products];

    // If "Sort By" is selected, reset category filter
    if (sortValue === "") {
      setFilterCategory("");
    } else {
      // Apply category filter if active
      if (filterCategory !== "") {
        sortedProducts = sortedProducts.filter(
          (item) => item.category === filterCategory
        );
      }

      // Apply sorting
      if (sortValue === "low-to-high") {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortValue === "high-to-low") {
        sortedProducts.sort((a, b) => b.price - a.price);
      }
    }

    // Apply search term if present
    if (searchTerm) {
      sortedProducts = sortedProducts.filter((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setProductsData(sortedProducts);
  };

  // Handle search
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    let searchedProducts = products;

    // Apply category filter if active
    if (filterCategory !== "") {
      searchedProducts = searchedProducts.filter(
        (item) => item.category === filterCategory
      );
    }

    // Apply search term
    if (searchValue) {
      searchedProducts = searchedProducts.filter((item) =>
        item.productName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply sorting if active
    if (sortOrder === "low-to-high") {
      searchedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      searchedProducts.sort((a, b) => b.price - a.price);
    }

    setProductsData(searchedProducts);
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Products" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilter} value={filterCategory}>
                  <option value="">All Categories</option>
                  <option value="sofa">Sofa</option>
                  <option value="mobile">Mobile</option>
                  <option value="chair">Chair</option>
                  <option value="watch">Watch</option>
                  <option value="wireless">Wireless</option>
                </select>
              </div>
            </Col>

            <Col lg="3" md="6" className="text-end">
              <div className="filter__widget">
                <select onChange={handleSort} value={sortOrder}>
                  <option value="">Sort By</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearch}
                  value={searchTerm}
                />
                <span>
                  <i className="ri-search-line" />
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Container>
          <Row>
            {productsData.length === 0 ? (
              <h1 className="text-center fs-4 no-products">
                No products found!
              </h1>
            ) : (
              <ProductsList data={productsData} />
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Shop;
