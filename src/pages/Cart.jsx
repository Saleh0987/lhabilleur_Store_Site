import React from "react";
import "../styles/cart.css";
import CommonSection from "../components/Ui/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import {Container, Row, Col} from "react-bootstrap";
import {motion} from "framer-motion";
import {cartActions} from "../redux/slices/cartSlice";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import unImage from "../assets/images/box_icon.svg";

function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <Helmet title="Cart">
      <CommonSection title="Shopping Cart" />

      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center py-5">
                  No items added to the cart
                </h2>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
            <Col lg="3">
              <div className="subtotal-section">
                <h6 className="d-flex align-items-center justify-content-between">
                  Subtotal
                  <span className="fs-4 fw-bold">${totalAmount}</span>
                </h6>
                <p className="mt-2">
                  Taxes and shipping will be calculated at checkout
                </p>
                <div>
                  <Link to="/checkout">
                    <button className="buy__btn w-100">Checkout</button>
                  </Link>
                  <Link to="/shop">
                    <button className="buy__btn w-100 mt-3">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

const Tr = ({item}) => {
  const dispatch = useDispatch();

  const deleteProduct = () => {
    dispatch(cartActions.deleteItem(item.id));
  };

  return (
    <tr>
      <td>
        <img src={item.imgUrl ? item.imgUrl : unImage} alt={item.productName} />
      </td>
      <td>{item.productName}</td>
      <td>${item.price}</td>
      <td>{item.quantity}</td>
      <td>
        <motion.i
          whileTap={{scale: 1.2}}
          onClick={deleteProduct}
          className="ri-delete-bin-line"
        />
      </td>
    </tr>
  );
};

export default Cart;
