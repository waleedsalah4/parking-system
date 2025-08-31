import {
  getErrorMessage,
  getFieldErrors,
  isHttpError,
  type ApiError,
} from "@/services/api";
import type { LoginResponse } from "@/types";
import { localStorageEnum } from "@/types/enums";
import toast from "react-hot-toast";

export const handleAPIError = (
  error: ApiError,
  msgs: {
    httpsErrorMessage: string;
    globalErrorMessage: string;
    deniedMessage: string;
  }
) => {
  const message = getErrorMessage(error);
  const fieldErrors = getFieldErrors(error);

  // Handle specific check-in errors
  if (isHttpError(error, 409)) {
    toast.error(msgs.httpsErrorMessage);
  } else if (isHttpError(error, 400)) {
    // Show field-specific validation errors
    if (Object.keys(fieldErrors).length > 0) {
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        messages.forEach((msg) => {
          toast.error(`${field}: ${msg}`, { duration: 5000 });
        });
      });
    } else {
      toast.error(message || "Invalid data");
    }
  } else if (isHttpError(error, 403)) {
    toast.error(msgs.deniedMessage);
  } else {
    toast.error(message || msgs.globalErrorMessage);
  }
};

export const storeTokens = (authData: LoginResponse) => {
  localStorage.setItem(localStorageEnum.token, authData.token);
  localStorage.setItem(localStorageEnum.user, JSON.stringify(authData.user));
};

export const ClearTokens = () => {
  localStorage.removeItem(localStorageEnum.token);
  localStorage.removeItem(localStorageEnum.user);
};
