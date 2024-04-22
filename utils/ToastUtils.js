import { toast } from "react-toastify";

export function mandaNotifica(text, tipo) {
  const option = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };
  switch (tipo) {
    case "success":
      return toast.success(text, option);
    case "error":
      return toast.error(text, option);
    case "info":
      return toast.info(text, option);
    case "warning":
      return toast.warning(text, option);
    case "loading":
      return toast.loading(text, option);
    default:
      return toast.default(text, option);
  }
}

export function dismissById(id) {
  toast.dismiss(id);
}
