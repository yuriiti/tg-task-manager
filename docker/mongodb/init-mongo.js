// MongoDB initialization script
// This script runs only on first container startup

db = db.getSiblingDB('task_manager');

// Create application user
db.createUser({
  user: 'task_manager_user',
  pwd: 'task_manager_password',
  roles: [
    {
      role: 'readWrite',
      db: 'task_manager'
    }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('tasks');

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 });
db.users.createIndex({ createdAt: 1 });

// Create indexes for tasks collection
db.tasks.createIndex({ userId: 1 });
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ createdAt: 1 });
db.tasks.createIndex({ userId: 1, status: 1 });
db.tasks.createIndex({ tags: 1 });

print('MongoDB initialization completed');
