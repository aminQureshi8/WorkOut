export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

export interface ProfileFormInputs {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}
