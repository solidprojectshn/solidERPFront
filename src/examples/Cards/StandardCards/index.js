import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

// Encapsulated component
function StandardCard({ title, value, disabled }) {
  return (
    <Card>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {/* Title */}
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{ color: "#a6a6a6", fontSize: "small", margin: "2%" }}
          >
            {title}
          </Typography>
        </Grid>
        {/* TextField */}
        <Grid item xs={12}>
          <TextField
            disabled={disabled}
            variant="outlined"
            value={value || ""}
            inputProps={{
              style: {
                color: "#000000",
                fontSize: "small",
                fontWeight: "bold",
                padding: "0",
              },
            }}
            sx={{
              width: "95%",
              border: "1px solid #6a6a6a",
              borderRadius: "5px",
              margin: "0% 2% 2% 2%",
              height: "6.6vh",
              "& .MuiOutlinedInput-root": {
                height: "100%",
                "& input": {
                  height: "100%",
                  padding: "0 14px",
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

// PropTypes for CarsDataCard
StandardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
};

// Default props
StandardCard.defaultProps = {
  value: "",
  disabled: true,
};

export default StandardCard;
