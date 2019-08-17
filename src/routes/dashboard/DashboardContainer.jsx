import React, { Component } from 'react';

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

  renderHeader = () => {
    const { headerData } = this.state.staticData;
    return (
    <div style={{ backgroundColor: "red", position: "fixed", top: 0, left: 0, right: 0 }}>
      {headerData.description}
    </div>
  )};

  renderFooter = () => {
    const { footerData } = this.state.staticData;
    return (
    <div style={{ backgroundColor: "red", position: "fixed", bottom: 0, left: 0, right: 0 }}>
      {footerData.description}
    </div>
  )};

  renderLoader = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>
  );

  renderMenu = () => (
    <div style={{ backgroundColor: "lightblue", display: "flex", flex: 2 }}>
      {this.renderFilterSection()}
      {this.renderFoodMenu()}
    </div>
  );

  applyFilter = (filter) => {
    console.log("filter:", filter);
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
    <div style={{ backgroundColor: "green", display: "flex", flex: 1, flexDirection: "column" }}>
      <div>{filtersData.heading}</div>
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
    <button onClick={() => this.addToCart(dish)}>
      {buttonText}
    </button>
  );

  searchFoodItem = (keyword) => {
    const newList = this.state.foodMenu.filter(item => item.key.toLowerCase().includes(keyword));
    this.setState({ foodList: newList });
  };

  renderFoodMenu = () => {
    const { staticData, foodMenu, foodList } = this.state;
    const { foodMenuData } = staticData;
    console.log('render food menu called');
    console.log('foodList is:', foodList);
    return (
      <div style={{ display: "flex", flex: 2, overflowY: "auto", flexDirection: "column", backgroundColor: "purple" }}>

        <div>
          <input type="text" placeholder={foodMenuData.searchText} onChange={(e) => this.searchFoodItem(e.target.value)} style={{ width: "30rem" }}/>
        </div>

        {
          foodList.map(dish => (
            <div style={{ backgroundColor: "yellow", display: "flex", flex: 1, marginBottom: "1rem" }} key={dish.key}>
              <img src={dish.image}
              />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>{dish.key}</div>
                  <div>{dish.ingredients}</div>
                <div style={{ display: "flex" }}>
                  <div style={{textDecorationLine: (dish.price !== dish.discountedPrice) ?'line-through': 'none', textDecorationStyle: 'solid'}}>Rs.{dish.price}</div>
                  {dish.price !== dish.discountedPrice && <div>{dish.discountedPrice}</div>}
                </div>
                  <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "red" }}>
                  <div>{dish.rating}/5</div>
                  {this.renderAddToCartButton(foodMenuData.addbuttonText, dish)}
                  </div>
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
    <button onClick={() => alert("Order placed! Your order will be delivered in next 30 mins")} style={{ color: "blue" }}>
      Confirm Order
    </button>
  );

  renderCartItems = () => (
    <div>
      {this.state.cartItems.map(item => (
      <div style={{ display: "flex", backgroundColor: "pink" }}>
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
    <div style={{ backgroundColor: "coral", display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
      <div>{summaryData.title}</div>
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
      <div style={{ backgroundColor: "yellow", minHeight: "100vh", display: "flex", flex: 1, flexDirection: "column" }}>
        {this.renderHeader()}
        <div style={{ display: "flex", flex: 1, marginTop: "2rem" }}>
          {this.renderMenu()}
          {this.renderOrderSummary()}
        </div>
        {this.renderFooter()}
      </div>
    )
  }
};
