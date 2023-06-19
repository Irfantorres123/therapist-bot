export function FormTextFieldProps() {
  return {
    margin: "normal",
    required: true,
    fullWidth: true,
    color: "secondary",
    InputLabelProps: {
      style: { fontWeight: 500, fontSize: "1rem", fontFamily: "Glory" },
    },
    InputProps: {
      style: { fontWeight: 500, fontSize: "1rem", fontFamily: "Glory" },
    },
  };
}

export function FormButtonProps() {
  return {
    type: "submit",
    fullWidth: true,
    variant: "contained",
  };
}
