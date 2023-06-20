import { Box, Switch, Typography } from "@mui/material";

export function TSwitch({ label, value, onChange, sx }) {
  return (
    <Box display="flex" width="100%" alignItems="center">
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Typography variant="h6" color="white">
          {label}
        </Typography>
        <Switch
          checked={value}
          onChange={onChange}
          color="secondary"
          sx={{ marginBottom: "1rem" }}
        />
      </Box>
      <Typography variant="h5" color="white">
        {value?.toString()}
      </Typography>
    </Box>
  );
}
