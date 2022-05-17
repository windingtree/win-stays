import { AppRole, User, UserDTO } from 'src/types';
import DBService from './DBService';
import bcrypt from 'bcrypt';
import TokenService from './TokenService';
import ApiError from '../exceptions/ApiError';

export default class UserService {
  private db;
  private loginDB;
  private dbService: DBService;
  private mainDB;

  constructor() {
    this.dbService = DBService.getInstance();
    this.db = this.dbService.getUserDB();
    this.mainDB = this.dbService.getDB();
    this.loginDB = this.dbService.getLoginDB();
  }

  public async getAllUsers() {
    const users = new Set<UserDTO>();
    const dbUsers: User[] = await this.db.values().all();

    dbUsers.map((i) => {
      const userDTO = this.getUserDTO(i);
      users.add(userDTO);
    });

    return Array.from(users);
  }

  public async createUser(login: string, password: string, roles: AppRole[]): Promise<void> {
    const userExists = await this.getUserIdByLogin(login);
    if (userExists) {
      throw ApiError.BadRequest('User already exists');
    }

    const id = await this.getId();
    const rounds = 2;
    const hashedPassword = await bcrypt.hash(String(password), rounds);
    await this.db.put(String(id),
      {
        id,
        login,
        password: hashedPassword,
        roles
      }
    );

    await this.loginDB.put(login, String(id));
    await this.mainDB.put('user_db_increment', id);
  }

  private async getId(): Promise<number> {
    try {
      return await this.mainDB.get('user_db_increment') + 1;
    } catch (e) {
      if (e.status === 404) {
        return 1;
      }
      throw e;
    }
  }

  public async getUserIdByLogin(login: string): Promise<number | null> {
    try {
      const userId = await this.loginDB.get(login);
      return Number(userId);
    } catch (e) {
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  public async getUserById(id: number): Promise<User> {
    return await this.db.get(String(id));
  }

  public async getUserByLogin(login: string): Promise<User | null> {
    const id = await this.getUserIdByLogin(login);
    if (!id) {
      return null;
    }
    return await this.getUserById(id);
  }

  public getUserDTO(user: User): UserDTO {
    return {
      id: user.id,
      login: user.login,
      roles: user.roles
    };
  }

  public async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    const login = user.login;

    await this.db.del(String(id));
    await this.loginDB.del(login);
  }

  public async checkCredentials(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  public async login(login, password) {
    const user = await this.getUserByLogin(login);
    if (!user) {
      throw ApiError.BadRequest('Incorrect login');
    }

    const passwordCorrect = await this.checkCredentials(user, password);
    if (!passwordCorrect) {
      throw ApiError.BadRequest('Incorrect password');
    }

    const userDTO = this.getUserDTO(user);

    const tokenService = new TokenService();
    const tokens = tokenService.generateTokens(userDTO);
    await tokenService.saveToken(tokens.refreshToken, userDTO.id);

    return {
      ...userDTO,
      ...tokens
    };
  }

  public async logout(token: string) {
    const tokenService = new TokenService();
    await tokenService.revokeToken(token);
  }

  public async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const tokenService = new TokenService();
    const data = tokenService.validateRefreshToken(refreshToken);
    const tokenInDB = await tokenService.checkRefreshInDB(refreshToken);

    if (!data || !tokenInDB) {
      throw ApiError.UnauthorizedError();
    }

    const user = await this.getUserById(data.id);
    const userDTO = this.getUserDTO(user);
    const tokens = tokenService.generateTokens(userDTO);
    await tokenService.revokeToken(refreshToken);
    await tokenService.saveToken(tokens.refreshToken, userDTO.id);

    return {
      ...userDTO,
      ...tokens
    };
  }
}
