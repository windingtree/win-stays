const checkEnvVariables = (vars: string[]): void =>
  vars.forEach(
    variable => {
      if (
        !process.env[variable] ||
        process.env[variable] === ''
      ) {
        throw new Error(`${variable} must be provided in the ENV`);
      }
    }
  );

checkEnvVariables([
  'REACT_APP_NETWORK_ID',
  'REACT_APP_NETWORK_NAME',
  'REACT_APP_BLOCK_EXPLORER',
  'REACT_APP_NETWORK_PROVIDER',
  // 'REACT_APP_CONTRACT_ADDRESS',
]);

export const chainId = Number(process.env.REACT_APP_NETWORK_ID);
export const name = process.env.REACT_APP_NETWORK_NAME as string;
export const blockExplorer = process.env.REACT_APP_BLOCK_EXPLORER as string;
export const address = process.env.REACT_APP_CONTRACT_ADDRESS as string;
export const rpc = process.env.REACT_APP_NETWORK_PROVIDER as string;
