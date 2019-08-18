import React, { Component } from 'react';
import { Link } from "react-router-dom";

import LoadingScreen from "../common/LoadingScreen";
import { getStaticData, getFoodMenu} from "../../services/dashboard/DashboardServices";

export default class DashboardContainer extends Component {

  state = {
    staticData: {},
    foodMenu: [],
    cartItems: [],
  };

  fetchStaticData = () => {
    getStaticData().then(staticData => {
      this.setState({ staticData });
    })
  };

  fetchFoodMenu = () => {
    getFoodMenu().then(foodMenu => {
      this.setState({ foodMenu, foodList: foodMenu });
    });
  };

   componentDidMount() {
    this.fetchStaticData();
    this.fetchFoodMenu();
  };

  renderFooter = () => {
    const { footerData } = this.state.staticData;
    return (
    <div style={{ position: "fixed", bottom: 0, right: 0 }}>
      {footerData.description}
    </div>
  )};

  renderLoader = () => (
    <LoadingScreen />
  );

  renderMenu = () => (
    <div style={{ display: "flex", flex: 2 }}>
      {this.renderFoodMenu()}
    </div>
  );

  applyFilter = (filter) => {
    let newArray = [];
    switch (filter) {
      case "MainCourse":
        newArray = this.state.foodMenu.filter(item => item.category === "MainCourse");
        this.setState({ foodList: newArray });
        break;
      case "Desserts":
        newArray = this.state.foodMenu.filter(item => item.category === "Desserts");
        this.setState({ foodList: newArray });
        break;
      case "priceLTH":
        newArray = this.state.foodMenu.sort((a, b) => (a.discountedPrice > b.discountedPrice) ? 1 : -1);
        this.setState({ foodList: newArray });
        break;
      case "priceHTL":
        newArray = this.state.foodMenu.sort((a, b) => (a.discountedPrice < b.discountedPrice) ? 1 : -1);
        this.setState({ foodList: newArray });
        break;
      case "ratingHTL":
        newArray = this.state.foodMenu.sort((a, b) => (a.rating < b.rating) ? 1 : -1);
        this.setState({ foodList: newArray });
        break;
      case "DiscountHTL":
        newArray = this.state.foodMenu.filter(item => item.price > item.discountedPrice);
        this.setState({ foodList: newArray });
        break;
      default:
        break;
    }
  };

  renderFilterSection = () => {
    const { filtersData } = this.state.staticData;
    return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ fontWeight: 800, marginBottom: "1rem" }}>{filtersData.heading}</div>
      {
        filtersData.filtersArray.map(filter => (
          <div>
          <div key={filter.key}>{filter.title}</div>
            {filter.subTitles.map(category => (
              <div key={category.key} onClick={() => this.applyFilter(category.key)} style={{ color: "blue" }}>{category.value}</div>
            ))}
          </div>
        ))
      }
    </div>
  )};

  addToCart = (dish) => {
        this.setState(prevState => ({ cartItems: [ ...prevState.cartItems, dish ] }));
  };

  renderAddToCartButton = (buttonText, dish) => (
    <button onClick={() => this.addToCart(dish)} style={{ borderRadius: "1rem", height: "2rem" }}>
      {buttonText}
    </button>
  );

  searchFoodItem = (keyword) => {
    const newList = this.state.foodMenu.filter(item => item.key.toLowerCase().includes(keyword));
    this.setState({ foodList: newList });
  };

  renderFoodMenu = () => {
    const { staticData, foodList } = this.state;
    const { foodMenuData } = staticData;
    console.log('render food menu called');
    console.log('foodList is:', foodList);
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <input type="text" placeholder={foodMenuData.searchText} onChange={(e) => this.searchFoodItem(e.target.value)} style={{ borderRadius: "1rem", height: "2rem", outline: "none", paddingLeft: "1rem", fontWeight: "bold", marginBottom: "1rem" }}/>
        {
          foodList.map(dish => (
            <div style={{ marginBottom: "1rem", display: "flex" }} key={dish.key}>
              <img src={dish.image}
              />
              <div>
                  <div>{dish.key}</div>
                  <div>{dish.ingredients}</div>
                  <div style={{textDecorationLine: (dish.price !== dish.discountedPrice) ?'line-through': 'none', textDecorationStyle: 'solid'}}>Rs.{dish.price}</div>
                  {dish.price !== dish.discountedPrice && <div>{dish.discountedPrice}</div>}
                  <div>{dish.rating}/5</div>
                  {this.renderAddToCartButton(foodMenuData.addbuttonText, dish)}
              </div>
            </div>
          ))
        }
      </div>
    );
  };

  renderEmptyCart = () => {
    const { summaryData } = this.state.staticData;
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
        <img
          src={summaryData.image}
        />
        <div>
          {summaryData.description}
        </div>
      </div>
    )};

  getTotalBill = () => {
    return this.state.cartItems.reduce((total, num) => total + num.discountedPrice, 0);
  };

  getConfirmButton = () => (
    <div style={{ backgroundColor: "lightGrey", borderRadius: "1rem", height: "2rem" }}>
      <Link to="/order-placed">Confirm Order</Link>
    </div>
  );

  renderCartItems = () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {this.state.cartItems.map(item => (
      <div style={{ display: "flex", backgroundColor: "white", marginBottom: "1rem", justifyContent: "space-between" }}>
       <div>{item.key}</div>
        <div>{item.discountedPrice}</div>
      </div>
    ))}
      Total bill: {this.getTotalBill()}
      {this.getConfirmButton()}
    </div>
  );

  renderOrderSummary = () => {
    const { summaryData } = this.state.staticData;
    return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontWeight: 800, marginBottom: "1rem" }}>{summaryData.title}</div>
      {this.state.cartItems.length === 0 ? this.renderEmptyCart() : this.renderCartItems() }
    </div>
)};

  render(){
    console.log('render called and state:', this.state);
    if(this.state.foodMenu.length === 0)
      return (
        this.renderLoader()
      );
    return(
      <div style={{ backgroundColor: "lightGrey", display: "flex" }}>
        <div style={{ display: "flex", paddingTop: "1rem", flex: 1 }}>
          {this.renderFilterSection()}
          {this.renderMenu()}
          {this.renderOrderSummary()}
        </div>
        {this.renderFooter()}
      </div>
    )
  }
};
