// MongoDB initialization script
// This script runs only on first container startup

// Switch to admin database to create user
db = db.getSiblingDB("admin");

// Create application user in admin database with permissions for task_manager
try {
  db.createUser({
    user: "task_manager_user",
    pwd: "task_manager_password",
    roles: [
      {
        role: "readWrite",
        db: "task_manager",
      },
    ],
  });
  print("User task_manager_user created successfully");
} catch (error) {
  if (error.code === 51003) {
    // User already exists
    print("User task_manager_user already exists, skipping creation");
  } else {
    throw error;
  }
}

// Switch to task_manager database
db = db.getSiblingDB("task_manager");

// Create collections
db.createCollection("users");
db.createCollection("tasks");

// Create indexes for users collection
db.users.createIndex({ userId: 1 }, { unique: true });
db.users.createIndex({ username: 1 });
db.users.createIndex({ createdAt: 1 });

// Create indexes for tasks collection
db.tasks.createIndex({ userId: 1 });
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ createdAt: 1 });
db.tasks.createIndex({ userId: 1, status: 1 });
db.tasks.createIndex({ tags: 1 });

print("MongoDB initialization completed");
