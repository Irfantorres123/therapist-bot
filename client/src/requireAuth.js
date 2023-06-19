const pagesThatRequireAuth = ["/", "/chat", "/logout"];

export const requireAuth = (page) => {
  return pagesThatRequireAuth.includes(page);
};
