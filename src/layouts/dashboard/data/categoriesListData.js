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

// Argon Dashboard 2 MUI components
import ArgonTypography from "components/ArgonTypography";

const categoriesListData = [
  {
    color: "dark",
    icon: <i className="ni ni-mobile-button" style={{ fontSize: "12px" }} />,
    name: "Stock",
    description: (
      <>
        250 en stock,{" "}
        <ArgonTypography variant="caption" color="text" fontWeight="medium">
          346+ vendidos
        </ArgonTypography>
      </>
    ),
    route: "/",
  },
];

export default categoriesListData;
