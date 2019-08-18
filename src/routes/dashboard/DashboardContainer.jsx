import React, { PureComponent } from 'react';
import { Link } from "react-router-dom";

import Dashboard from "./Dashboard";
import LoadingScreen from "../common/LoadingScreen";
import { getStaticData, getFoodMenu} from "../../services/dashboard/DashboardServices";

const styles = {
  footerStyles: {
		position: "fixed", bottom: 0, right: 0,
	},
  filtersContainer: { display: "flex", flexDirection: "column", flex: 1 },
  boldText: { fontWeight: 800, marginBottom: "1rem" },
  buttonStyles: { borderRadius: "1rem", height: "2rem", marginTop: "2rem", outline: "none" },
  foodMenuContainer : { display: "flex", flexDirection: "column", flex: 1 },
  searchBar: { borderRadius: "1rem", height: "2rem", outline: "none", paddingLeft: "1rem", fontWeight: "bold", marginBottom: "1rem" },
  dishContainer: { marginBottom: "1rem", display: "flex" },
  discountedPrice: { color: "blue", marginLeft: "1rem" },
  cartItemsContainer: { display: "flex", flexDirection: "column" },
  cartItem: { display: "flex", backgroundColor: "white", justifyContent: "space-between", marginBottom: "1rem" },
  emptyCartContainer: { display: "flex", flex: 1, flexDirection: "column", alignItems: "center" },
};

export default class DashboardContainer extends PureComponent {

  state = {
    staticData: {},
    foodMenu: [],
    foodList: [],
    cartItems: [],
  };

  componentDidMount() {
    this.fetchStaticData();
    this.fetchFoodMenu();
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

  applyFilter = (filter) => {
    this.setState({ filter });
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
    <div style={styles.filtersContainer}>
      <div style={styles.boldText}>{filtersData.heading}</div>
      {
        filtersData.filtersArray.map(filter => (
          <div>
          <div key={filter.key}>{filter.title}</div>
            {filter.subTitles.map(category => (
              <div key={category.key} onClick={() => this.applyFilter(category.key)} style={{ color: "blue", fontWeight: (category.key === this.state.filter) ? "bold" : "normal" }}>{category.value}</div>
            ))}
          </div>
        ))
      }
    </div>
  )};

  addToCart = (dish) => {
        this.setState(prevState => ({ cartItems: [ ...prevState.cartItems, dish ] }));
  };


  searchFoodItem = (keyword) => {
    const newList = this.state.foodMenu.filter(item => item.key.toLowerCase().includes(keyword));
    this.setState({ foodList: newList });
  };

  renderAddToCartButton = (buttonText, dish) => (
    <button onClick={() => this.addToCart(dish)} style={styles.buttonStyles}>
      <div style={{ color: "blue", fontWeight: 800 }}>{buttonText}</div>
    </button>
  );


  renderFoodMenu = () => {
  	const { staticData, foodList } = this.state;
    const { foodMenuData } = staticData;
    return (
      <div style={styles.foodMenuContainer}>
          <input type="text" placeholder={foodMenuData.searchText} onChange={(e) => this.searchFoodItem(e.target.value)} style={styles.searchBar}/>
        {
          foodList.map(dish => (
            <div style={styles.dishContainer} key={dish.key}>
              <img src={dish.image}
              />
              <div style={{ marginLeft: "2rem" }}>
                  <div style={styles.boldText}>{dish.key}</div>
                  <div>{dish.ingredients}</div>
                <div style={{ display: "flex" }}>
                  <div style={{textDecorationLine: (dish.price !== dish.discountedPrice) ?'line-through': 'none', textDecorationStyle: 'solid', color: (dish.price !== dish.discountedPrice) ? 'red': 'blue', }}>Rs.{dish.price}</div>
                  {dish.price !== dish.discountedPrice && <div style={styles.discountedPrice}>{dish.discountedPrice}</div>}
                </div>
                  <div>Rating {dish.rating}/5</div>
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
      <div style={styles.emptyCartContainer}>
        <img
          src={summaryData.image}
        />
        <div style={{ marginTop: "2rem" }}>
          {summaryData.description}
        </div>
      </div>
    )
  };

  getTotalBill = () => {
    return this.state.cartItems.reduce((total, num) => total + num.discountedPrice, 0);
  };

  getConfirmButton = () => (
    <button style={styles.buttonStyles}>
      <div style={{ fontWeight: 800 }}>
        <Link to="/order-placed">
        Confirm Order
        </Link>
      </div>
    </button>
  );

  renderCartItems = () => (
    <div style={styles.cartItemsContainer}>
      {this.state.cartItems.map(item => (
      <div style={styles.cartItem}>
       <div>{item.key}</div>
        <div style={styles.discountedPrice}>Rs.{item.discountedPrice}</div>
      </div>
    ))}
      <div style={styles.boldText}>Total bill: Rs.{this.getTotalBill()}</div>
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
		)
  };

  renderFooter = () => {
    const { footerData } = this.state.staticData;
    return (
      <div style={styles.footerStyles}>
        {footerData.description}
      </div>
    )
  };

  renderLoader = () => (
    <LoadingScreen />
  );

  renderMenu = () => (
    <div style={{ display: "flex", flex: 2 }}>
      {this.renderFoodMenu()}
    </div>
  );

  render(){
    if(Object.keys(this.state.staticData).length === 0 || this.state.foodMenu.length === 0)
      return (
        this.renderLoader()
      );
    return(
      <Dashboard
        staticData={this.state.staticData}
        foodMenu={this.state.foodMenu}
        foodList={this.state.foodList}
        cartItems={this.state.cartItems}
        renderFilterSection={this.renderFilterSection}
        renderMenu={this.renderMenu}
        renderOrderSummary={this.renderOrderSummary}
        renderFooter={this.renderFooter}
      />
    )
  }
};
