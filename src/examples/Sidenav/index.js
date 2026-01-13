/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Collapse from "@mui/material/Collapse";  // collapse para manejar la animación
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

//https://mui.com/material-ui/material-icons/

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import SidenavItem from "examples/Sidenav/SidenavItem";
import SidenavFooter from "examples/Sidenav/SidenavFooter";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Argon Dashboard 2 MUI context
import { useArgonController, setMiniSidenav } from "context";
import { Padding } from "@mui/icons-material";
import ArgonButton from "components/ArgonButton";

import { logout } from "./../../redux/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, darkSidenav, layout } = controller;
  const location = useLocation();
  const { pathname } = location;
  const itemName = pathname.split("/").slice(1)[0];
  const dispatchReducer = useDispatch()
  const navigate = useNavigate()

  const [openSections, setOpenSections] = useState({});  // Estado para manejar qué secciones están abiertas

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const handleLogout = () => {
    dispatchReducer(logout())
    navigate("/")
  }

  const {
    permissions: userPermissions
  } = useSelector((store) => store.auth);

  const renderRoutes = routes.map(({ type, name, icon, title, key, href, route, collapse, permissions }) => {
    let returnValue;
    if (permissions && !permissions?.some(element => userPermissions.includes(element))) {
      return null
    }
    else {
      if (type === "route") {
        if (href) {
          returnValue = (
            <Link href={href} key={key} target="_blank" rel="noreferrer">
              <SidenavItem
                name={name}
                icon={icon}
                active={key === itemName}
                noCollapse={noCollapse}
              />
            </Link>
          );
        } else {
          returnValue = (
            <NavLink to={route} key={key}>
              <SidenavItem name={name} icon={icon} active={key === itemName} />
            </NavLink>
          );
        }
      } else if (type === "title") {
        returnValue = (
          <ArgonTypography
            key={key}
            color={darkSidenav ? "white" : "dark"}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            opacity={0.6}
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </ArgonTypography>
        );
      } else if (type === "divider") {
        returnValue = <Divider key={key} light={darkSidenav} />;
      } else if (type === "collapse") {
        returnValue = (
          <div key={key}>
            <SidenavItem
              name={name}
              icon={icon}
              active={key === itemName}
              onClick={() => toggleSection(key)}  // Controla el colapso con onClick
              rightIcon={
                <KeyboardArrowRightOutlinedIcon
                  sx={{
                    transform: openSections[key] ? "rotate(90deg)" : "rotate(0deg)",  // Rotar la flecha 90 grados cuando está expandido
                    transition: "transform 0.3s ease",  // Suavizar la rotación
                  }}
                />
              }
            />
            <Collapse in={openSections[key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ paddingLeft: "20px" }}>
                {collapse.map(({ name: subName, route: subRoute, key: subKey, icon: subIcon, permissions }) => (  // subicono
                  permissions && permissions?.some(element => userPermissions.includes(element)) && (
                    <NavLink to={subRoute} key={subKey}>
                      <SidenavItem
                        name={subName}
                        icon={subIcon}
                        active={subKey === itemName}
                      />
                    </NavLink>
                  )

                ))}
              </List>
            </Collapse>
          </div>
        );
      }

      return returnValue;

    }


  });

  return (
    <SidenavRoot {...rest}
      variant="permanent"
      ownerState={{ darkSidenav, miniSidenav, layout }}
    >
      <ArgonBox pt={3} pb={1} px={4} textAlign="center">
        <ArgonBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
        </ArgonBox>
        <ArgonBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && (
            <ArgonBox
              component="img" src={brand} alt="Logo Dursan Sidenav" width="100%" mr={0.25} /> //logo sidenav
          )}
          <ArgonBox
            width={!brandName && "0"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <ArgonTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              color={darkSidenav ? "white" : "dark"}
            >
              {brandName}
            </ArgonTypography>
          </ArgonBox>
        </ArgonBox>
      </ArgonBox>
      <Divider light={darkSidenav} />
      <List>{renderRoutes}</List>
      {/* <ArgonBox pt={1} mt="auto" mb={2} mx={2}>
        <SidenavFooter />
      </ArgonBox> */}
      <ArgonBox pt={1} mt="auto" mb={2} mx={2}>
        <ArgonButton 
          onClick={handleLogout}
          sx={{
            width:'100%',
            backgroundColor: "#ffffff", // Hexadecimal o cualquier valor CSS
            color: "#333", // Color del texto
            border:'1px solid #333',
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "transparent", // Fondo transparente al hover
              color: "#ff0000",                // Texto blanco al hover
              borderColor: "#ff0000",
            },
          }}
        >
          Cerrar Sesión
        </ArgonButton>
      </ArgonBox>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
