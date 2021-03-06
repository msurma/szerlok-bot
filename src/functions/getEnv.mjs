import dotenv from 'dotenv';

export default (envName) => {
  const result = dotenv.config();

  if (result.error) {
    throw result.error;
  }

  return process.env[envName];
};
