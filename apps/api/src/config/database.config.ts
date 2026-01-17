export const databaseConfig = () => {
  const host = process.env.MONGODB_HOST || 'localhost';
  const port = process.env.MONGODB_PORT || '27017';
  const database = process.env.MONGODB_DATABASE || 'task_manager';
  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin';

  if (user && password) {
    return {
      uri: `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=${authSource}`,
    };
  }

  return {
    uri: `mongodb://${host}:${port}/${database}`,
  };
};
