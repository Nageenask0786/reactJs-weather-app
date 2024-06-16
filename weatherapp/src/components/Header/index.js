import { MdDarkMode, MdLightMode } from "react-icons/md";

import "./index.css";

const Header = (props) => {
  const { isDarkTheme, toggleTheme } = props; //Destructuring props to access isDarkTheme and toggleTheme
  //Conditionally applying styles based on the theme
  const headerClassName = isDarkTheme ? "dark-theme" : "light-theme";
  const btnClassName = isDarkTheme ? "dark-theme-btn" : "light-theme-btn";
  // Conditionally rendering the theme icon based on the current theme
  const themeIcon = isDarkTheme ? (
    <MdLightMode color="#ffffff" size={30} />
  ) : (
    <MdDarkMode color="black" size={30} />
  );

  // Rendering the header with a button to toggle the theme
  return (
    <header className={headerClassName}>
      <button type="button" className={btnClassName} onClick={toggleTheme}>
        {themeIcon}
      </button>
    </header>
  );
};

export default Header;
