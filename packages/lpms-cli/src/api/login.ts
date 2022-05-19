import type { ActionController, LoginTokens } from '../types';
import axios from 'axios';
import ora from 'ora';
import { requiredConfig, getConfig, saveConfig } from './config';
import { green } from '../utils/print';

export const isLoggedIn = (): boolean => !!getConfig('login');

export const getAuthHeader = async () => {
  if (!isLoggedIn()) {
    throw new Error('Not logged in. Use "login" command before');
  }

  const { data: { accessToken, refreshToken }} = await axios.post(
    `${getConfig('apiUrl')}/api/user/refresh`,
    undefined,
    {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        Cookie: `refreshToken=${(getConfig('login') as LoginTokens).refreshToken}`
      }
    }
  );

  saveConfig('login', { accessToken, refreshToken });

  return {
    Authorization: `Bearer ${accessToken}`
  };
};

export const loginController: ActionController = async ({ login, password }, program) => {
  const spinner = ora('Logging in').start();

  try {
    requiredConfig(['apiUrl']);

    const { data: { accessToken, refreshToken }} = await axios.post(
      `${getConfig('apiUrl')}/api/user/login`,
      {
        login,
        password
      }
    );

    saveConfig('login', { accessToken, refreshToken });

    spinner.stop();

    green(`"${login}" user has been successfully logged in`);
  } catch (error) {
    spinner.stop();
    program.error(error, { exitCode: 1 });
  }
}
