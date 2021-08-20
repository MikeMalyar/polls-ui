export class UserLoginDto {
  login: string;
  password: string;
}

export class RegistrationDto {
  login: string;
  password: string;
  repeatPassword: string;
  email: string;
  fullName: string;
}
