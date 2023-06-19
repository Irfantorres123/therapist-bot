import { Box, Slider, Typography } from "@mui/material";

export function TSlider({ label, value, onChange, min, max, step, sx }) {
  return (
    <Box display="flex" width="100%" alignItems="center">
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Typography variant="h6" color="white">
          {label}
        </Typography>
        <Slider
          orientation="horizontal"
          aria-label="Temperature"
          valueLabelDisplay="auto"
          color="secondary"
          size="small"
          name="temperature"
          min={0}
          step={0.01}
          max={1}
          value={value}
          onChange={onChange}
          sx={sx}
        />
      </Box>
      <Typography variant="h5" color="white">
        {value}
      </Typography>
    </Box>
  );
}
