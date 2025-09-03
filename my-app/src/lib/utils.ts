import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FormErrorHandler } from "./FormErrorHandler";
import { toast } from "sonner";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type ErrorHandlerResult = {
  fieldErrors?: Record<string, string>;
};

export const handleErrorApi = (error: any, defaultText = "Có lỗi xảy ra"): ErrorHandlerResult | undefined => {
  const handler = new FormErrorHandler(error?.response || {});
  if (handler.hasErrors()) {
    if (handler.generalError) {
      toast.error(handler.generalError);
    }
    if (Object.keys(handler.fieldErrors).length > 0) {
      return { fieldErrors: handler.fieldErrors };
    }
  } else {
    toast.error(error?.response?.data?.message || defaultText);
  }
  return;
};
