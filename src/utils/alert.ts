import Swal, { SweetAlertIcon } from "sweetalert2";

interface AlertOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  timer?: number;
  showConfirmButton?: boolean;
}

interface ConfirmOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

interface ToastOptions {
  title: string;
  icon?: SweetAlertIcon;
  timer?: number;
}

export function showAlert(options: AlertOptions): Promise<any>;
export function showAlert(title: string, text?: string, icon?: SweetAlertIcon, confirmButtonColor?: string, confirmButtonText?: string): Promise<any>;
export function showAlert(
  optionsOrTitle: AlertOptions | string,
  text = "",
  icon: SweetAlertIcon = "info",
  confirmButtonColor = "#7c3aed",
  confirmButtonText = "باشه"
) {
  if (typeof optionsOrTitle === "string") {
    return Swal.fire({
      title: optionsOrTitle,
      text,
      icon,
      confirmButtonText,
      confirmButtonColor,
      background: "#111827",
      color: "#ffffff",
      customClass: {
        popup: "border border-white/10 rounded-2xl",
      },
    });
  }

  const {
    title,
    text: optText = "",
    icon: optIcon = "info",
    confirmButtonText: optConfirmButtonText = "باشه",
    confirmButtonColor: optConfirmButtonColor = "#7c3aed",
    timer,
    showConfirmButton = true,
  } = optionsOrTitle;

  return Swal.fire({
    title,
    text: optText,
    icon: optIcon,
    confirmButtonText: optConfirmButtonText,
    confirmButtonColor: optConfirmButtonColor,
    timer,
    showConfirmButton,
    background: "#111827",
    color: "#ffffff",
    customClass: {
      popup: "border border-white/10 rounded-2xl",
    },
  });
}

export function showConfirm(options: ConfirmOptions): Promise<boolean>;
export function showConfirm(title: string, text?: string, confirmButtonText?: string, icon?: SweetAlertIcon, confirmButtonColor?: string, cancelButtonColor?: string, cancelButtonText?: string): Promise<boolean>;
export async function showConfirm(
  optionsOrTitle: ConfirmOptions | string,
  text = "",
  confirmButtonText = "بله",
  icon: SweetAlertIcon = "warning",
  confirmButtonColor = "#ef4444",
  cancelButtonColor = "#374151",
  cancelButtonText = "انصراف"
) {
  if (typeof optionsOrTitle === "string") {
    const result = await Swal.fire({
      title: optionsOrTitle,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor,
      cancelButtonColor,
      background: "#111827",
      color: "#ffffff",
      customClass: {
        popup: "border border-white/10 rounded-2xl",
      },
    });
    return result.isConfirmed;
  }

  const {
    title,
    text: optText = "",
    icon: optIcon = "warning",
    confirmButtonText: optConfirmButtonText = "بله",
    cancelButtonText: optCancelButtonText = "انصراف",
    confirmButtonColor: optConfirmButtonColor = "#ef4444",
    cancelButtonColor: optCancelButtonColor = "#374151",
  } = optionsOrTitle;

  const result = await Swal.fire({
    title,
    text: optText,
    icon: optIcon,
    showCancelButton: true,
    confirmButtonText: optConfirmButtonText,
    cancelButtonText: optCancelButtonText,
    confirmButtonColor: optConfirmButtonColor,
    cancelButtonColor: optCancelButtonColor,
    background: "#111827",
    color: "#ffffff",
    customClass: {
      popup: "border border-white/10 rounded-2xl",
    },
  });
  return result.isConfirmed;
}

export const showToast = ({
  title,
  icon = "success",
  timer = 1500,
}: ToastOptions) => {
  return Swal.fire({
    title,
    icon,
    timer,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
    background: "#111827",
    color: "#ffffff",
    customClass: {
      popup: "border border-white/10 rounded-xl",
    },
  });
};
