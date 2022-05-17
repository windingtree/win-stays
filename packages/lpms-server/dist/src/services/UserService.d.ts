import { AppRole, User, UserDTO } from 'src/types';

export default class UserService {
  private db;
  private loginDB;
  private dbService;
  private mainDB;

  constructor();

  getAllUsers(): Promise<UserDTO[]>;

  createUser(login: string, password: string, roles: AppRole[]): Promise<void>;

  private getId;

  getUserIdByLogin(login: string): Promise<number | null>;

  getUserById(id: number): Promise<User>;

  getUserByLogin(login: string): Promise<User | null>;

  getUserDTO(user: User): UserDTO;

  deleteUser(id: number): Promise<void>;

  checkCredentials(user: User, password: string): Promise<boolean>;

  login(login: any, password: any): Promise<{
    accessToken: string;
    refreshToken: string;
    id: number;
    login: string;
    roles: AppRole[];
  }>;

  logout(token: string): Promise<void>;

  refresh(refreshToken: any): Promise<{
    accessToken: string;
    refreshToken: string;
    id: number;
    login: string;
    roles: AppRole[];
  }>;
}
