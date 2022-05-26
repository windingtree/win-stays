import type { ActionController } from '../types';
import { createReadStream } from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import ora from 'ora';
import { requiredConfig, getConfig, saveConfig } from './config';
import { green, yellow, red } from '../utils/print';
import { getAuthHeader } from './login';


export const storageController: ActionController = async ({ metadata, file, save }, program) => {
  const spinner = ora('Authenticating').start();

  try {
    requiredConfig(['apiUrl']);

    if (!metadata && !file) {
      throw new Error('Either --metadata or --file option must be provided');
    }

    if (metadata && file) {
      yellow(
        'You specified both --metadata and --file option at once. --file option is ignored'
      );
    }

    const authHeader = await getAuthHeader();

    const filePath = (metadata || file) as string;
    const form = new FormData();
    form.append('file', createReadStream(filePath));
    const formHeaders = form.getHeaders();

    spinner.text = `Uploading ${filePath}`;

    const response = await axios.post(
      `${getConfig('apiUrl')}/api/storage/${metadata ? 'metadata' : 'file'}`,
      form,
      {
        headers: {
          ...authHeader,
          ...formHeaders,
        }
      }
    );

    spinner.stop();

    if (response.status === 200) {
      green(
        `${filePath} has been uploaded successfully. Storage Id (URI): ${response.data[0]}`
      );

      if (save) {
        saveConfig('metadataUri', response.data[0]);
        yellow(
          '\nThe service provider\'s metadata file URI has been successfully saved to the CLI config'
        );
      }
      return;
    }

    red(
      `Something went wrong. Server responded with status: ${response.status}`
    );
  } catch (error) {
    spinner.stop();
    program.error(error, { exitCode: 1 });
  }
};
