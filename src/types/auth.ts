export interface LoginFormData {
  phone: string;
  password: string;
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
