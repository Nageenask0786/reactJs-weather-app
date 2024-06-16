import { Component } from "react";

import { TailSpin } from "react-loader-spinner";
import { LiaWindSolid } from "react-icons/lia";
import { WiHumidity } from "react-icons/wi";
import { CgCompressV } from "react-icons/cg";
import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";

import Header from "../Header";

import "./index.css";
const apiKey = "f704ce688cb1dfa0f4c5317a5b691a48";

// Constants to manage API status
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  inProgress: "IN_PROGRESS",
  failure: "FAILURE",
};

class WeatherApp extends Component {
  // Initial state of the component
  state = {
    isDarkTheme: false,
    searchText: "",
    showErrorMsg: false,
    errorMsg: "",
    weatherUpdates: {},
    apiStatus: apiStatusConstants.initial,
  };

  // Function to handle invalid search input
  onInValidSearch = () => {
    this.setState({
      showErrorMsg: true,
      errorMsg: "*Please Enter Valid Location",
    });
  };

   // Function to handle changes in the search input field
  onChangeOfSearchText = (event) => {
    this.setState({ searchText: event.target.value });
  };

  // Function to toggle the theme between light and dark
  toggleTheme = () => {
    this.setState((prevState) => ({ isDarkTheme: !prevState.isDarkTheme }));
  };

   // Function to handle the search button click event
  onClickOfSearchBtn = async (event) => {
    event.preventDefault();
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const { searchText } = this.state;
    try {
      // Fetching the geographic coordinates for the entered city
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchText}&limit=1&appid=${apiKey}`
      );
      const data = await response.json();

      const latitude = data[0].lat;
      const longitude = data[0].lon;
      if (response.ok && data.length !== 0) {
        // Fetching weather data using the geographic coordinates
        const weatherDataResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );

        const weatherData = await weatherDataResponse.json();
        //Formatting the data fetched from the api according to app requirements
        const formattedData = {
          name: weatherData.name,
          temperature: weatherData.main.temp,
          feelsLike: weatherData.main.feels_like,
          minimumTemperature: weatherData.main.temp_min,
          maximumTemperature: weatherData.main.temp_max,
          pressure: weatherData.main.pressure,
          visibilty: weatherData.visibility,
          humidity: weatherData.main.humidity,
          weatherId: weatherData.id,
          weather: weatherData.weather[0].main,
          weatherDescription: weatherData.weather[0].description,
          date: new Date(weatherData.dt * 1000).toDateString(),
          windSpeed: weatherData.wind.speed,
          country: weatherData.sys.country,
          imageUrl: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
        };
        this.setState({
          weatherUpdates: formattedData,
          showErrorMsg: false,
          errorMsg: "",
          apiStatus: apiStatusConstants.success,
        });
      } else {
        this.setState({ apiStatus: apiStatusConstants.failure });
        this.onInValidSearch();
      }
    } catch (error) {
      console.log(`Some Error ${error.message}`); // Catching the error and appropriately displaying error message
      this.setState({ apiStatus: apiStatusConstants.failure });
      this.onInValidSearch(); 
    }
  };

  // Function to render the loader while apiStatus is in Progress
  renderLoader = () => {
    const { isDarkTheme } = this.state;
    const spinnerColor = isDarkTheme ? "#ffffff" : "#3399ff";
    const wrapperClassName = isDarkTheme
      ? "container-dark-theme"
      : "container-light-theme";
    return (
      <TailSpin
        visible={true}
        height="40"
        width="40"
        color={spinnerColor}
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperClass={wrapperClassName}
        wrapperStyle={{ display: "flex", justifyContent: "center" }}
      />
    );
  };

  // Function to render the weather updates
  renderWeatherUpdates = () => {
    const { weatherUpdates, isDarkTheme } = this.state;
    const {
      name,
      date,
      temperature,
      feelsLike,
      weather,
      imageUrl,
      weatherDescription,
      pressure,
      windSpeed,
      humidity,
      maximumTemperature,
      minimumTemperature,
      visibilty,
    } = weatherUpdates;
     //conditionally apply styles based on theme
    const weatherDetailsClassName = isDarkTheme
      ? "container-dark-theme"
      : "container-light-theme";
    const locationandDateStyle = isDarkTheme
      ? "date-and-location-dark-theme"
      : "date-and-location-light-theme";
    const temperatureDetailsClassName = isDarkTheme
      ? "temperature-container-dark-theme"
      : "temperature-container-light-theme";
    const otherWeatherDetailsClassName = isDarkTheme
      ? "other-weather-details-dark-theme"
      : "other-weather-details-light-theme";
    return (
      <>
        {weatherUpdates !== undefined && (
          <div className={weatherDetailsClassName}>
            <div className="flex">
              <p className={locationandDateStyle}>{date}</p>

              <p className={locationandDateStyle}>{name}</p>
            </div>

            <div className={temperatureDetailsClassName}>
              <div className="temperature-container">
                <p className="temperature">{`${Math.floor(temperature)}°`}</p>
                <p className="temperature-details">{`Feels Like ${Math.floor(
                  feelsLike
                )}°/${weather}`}</p>
                <p className="temperature-description">{weatherDescription}</p>
              </div>
              <img src={imageUrl} alt="icon" className="icon" />
            </div>
            <p className={locationandDateStyle}>Other Details:</p>
            <div className="other-details-container">
              <div>
                <CgCompressV size={30} color="#3399ff" />
                <p className={otherWeatherDetailsClassName}>Pressure</p>
                <p
                  className={otherWeatherDetailsClassName}
                  style={{ fontWeight: "500", margin: "0px", padding: "0px" }}
                >
                  {pressure}
                </p>
              </div>
              <div>
                <WiHumidity size={30} color="#3399ff" />
                <p className={otherWeatherDetailsClassName}>Humidity</p>
                <p
                  className={otherWeatherDetailsClassName}
                  style={{ fontWeight: "500", margin: "0px", padding: "0px" }}
                >
                  {humidity}
                </p>
              </div>
              <div>
                <LiaWindSolid size={30} color="#3399ff" />
                <p className={otherWeatherDetailsClassName}>Wind Speed</p>
                <p
                  className={otherWeatherDetailsClassName}
                  style={{ fontWeight: "500", margin: "0px", padding: "0px" }}
                >
                  {windSpeed}
                </p>
              </div>
              <div>
                <FaTemperatureHigh size={30} color="#3399ff" />
                <p className={otherWeatherDetailsClassName}>Max Temp</p>
                <p
                  className={otherWeatherDetailsClassName}
                  style={{ fontWeight: "500", margin: "0px", padding: "0px" }}
                >
                  {maximumTemperature}
                </p>
              </div>
              <div>
                <FaTemperatureLow size={30} color="#3399ff" />
                <p className={otherWeatherDetailsClassName}>Min Temp</p>
                <p
                  className={otherWeatherDetailsClassName}
                  style={{ fontWeight: "500", margin: "0px", padding: "0px" }}
                >
                  {minimumTemperature}
                </p>
              </div>
              <div>
                <MdVisibility size={30} color="#3399ff" />
                <p className={otherWeatherDetailsClassName}>Visibility</p>
                <p
                  className={otherWeatherDetailsClassName}
                  style={{ fontWeight: "500", margin: "0px", padding: "0px" }}
                >
                  {visibilty}
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  //Function to render the failure view
  renderFailureView = () => {
    const { isDarkTheme, showErrorMsg, errorMsg } = this.state;
    const containerClassName = isDarkTheme
      ? "container-dark-theme"
      : "container-light-theme";
    return (
      <div className={containerClassName} style={{justifyContent : "center"}}>
        {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
      </div>
    );
  };

//Rendering final view based on apiStatus
  renderFinalView = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderWeatherUpdates();
      case apiStatusConstants.inProgress:
        return this.renderLoader();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      default:
        return null;
    }
  };

  // Main render method
  render() {
    const { isDarkTheme, searchText } = this.state;
    //conditionally apply styles based on theme
    const containerClassName = isDarkTheme
      ? "dark-theme-container"
      : "light-theme-container";
    const mainHeadingClassName = isDarkTheme
      ? "dark-theme-heading"
      : "light-theme-heading";
    return (
      <div className={containerClassName}>
      {/* //Passing the required props to header commponent to handle the theme  */}
        <Header isDarkTheme={isDarkTheme} toggleTheme={this.toggleTheme} /> 
        <h1 className={mainHeadingClassName}>
          Enter Valid City Name For Weather Updates
        </h1>
        <form onSubmit={this.onClickOfSearchBtn}>
          <input
            type="search"
            className="input"
            placeholder="Enter Location"
            value={searchText}
            onChange={this.onChangeOfSearchText}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
        {this.renderFinalView()} 
      </div>
    );
  }
}

export default WeatherApp;
