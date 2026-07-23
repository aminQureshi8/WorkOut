export interface LoginFormData {
  phone: string;
}

export interface RegisterFormData {
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface OtpFormData {
  phone: string;
  code: string;
}

export interface AuthApiResponse {
  message: string;
}
