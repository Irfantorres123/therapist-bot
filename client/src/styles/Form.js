export function FormContainerStyles() {
  return {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "50px",
    background: "linear-gradient(145deg, #191919, #1e1e1e)",
    boxShadow: "23px 23px 46px #181818, -23px -23px 46px #202020",
    padding: "5rem 3rem",
  };
}

export function FormButtonStyles() {
  return {
    fontWeight: 700,
    fontSize: "1rem",
    fontFamily: "Glory",
    borderRadius: "50px",
    background: "linear-gradient(145deg, #1e1e1e, #191919)",
    transition: "all 0.2s ease-in-out",
    width: "calc(100% - 5px)",
    height: "32px",
  };
}

export function FormButtonBoxStyles() {
  return {
    backgroundImage:
      "linear-gradient(205deg, #4158D0 0%, #C850C0 46%, #7770ff 100%)",
    padding: "5px",
    borderRadius: "50px",
    boxShadow: "13px 13px 26px #161616, -13px -13px 26px #222222",
    transition: "all 0.2s ease-in-out",
  };
}
