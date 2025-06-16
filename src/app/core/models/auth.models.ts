export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
  expiresAt: Date;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}