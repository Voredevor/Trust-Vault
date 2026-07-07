export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password?: string;
  status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISABLED';
  role?: 'USER' | 'ADMIN' | 'SUPPORT';
}
