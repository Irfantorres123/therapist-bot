import { useNavigate } from "react-router-dom";

export function useHistoryNavigate() {
  const navigate = useNavigate();
  const func = (path, options) => {
    if (path === window.location.pathname) return;
    navigate(path, {
      state: { previousPath: window.location.pathname },
      ...options,
    });
  };
  return func;
}
