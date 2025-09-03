import { constDefault } from "./constanst";
import { BackendFieldError } from "./type";

export class FormErrorHandler {
  fieldErrors: Record<string, string> = {};
  generalError: string | null = null;
  status?: number;

  constructor(
    private axiosResponse?: any 
  ) {
  
    this.status = axiosResponse?.status;
    const errorArray: BackendFieldError[] = axiosResponse?.data?.error || [];
    if ((this.status === constDefault.ENTITY_ERROR_STATUS || this.status === 422) && errorArray.length) {
      errorArray.forEach((e) => {
        this.fieldErrors[e.path] = e.msg;
      });
    } else if (axiosResponse) {
      switch (this.status) {
        case constDefault.AUTHENTICATION_ERROR_STATUS:
          this.generalError = "Authentication failed";
          break;
        case constDefault.FORBIDDEN_ERROR_STATUS:
          this.generalError = "You do not have permission";
          break;
        case constDefault.NOT_FOUND_ERROR_STATUS:
          this.generalError = "Resource not found";
          break;
        case constDefault.INTERNAL_SERVER_ERROR_STATUS:
          this.generalError = "Internal server error";
          break;
        default:
          this.generalError =
            axiosResponse?.data?.message || "Something went wrong";
      }
    }
  }

  getFieldError(field: string) {
    return this.fieldErrors[field] || null;
  }

  hasErrors() {
    return Object.keys(this.fieldErrors).length > 0 || !!this.generalError;
  }
}
