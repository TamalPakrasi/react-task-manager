// users schema
const UsersSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["username", "email", "password"],
    properties: {
      username: {
        bsonType: "string",
        description: "Username is required and must be a string",
      },
      email: {
        bsonType: "string",
        description: "Email is required and must be a string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      },
      password: {
        bsonType: "string",
        description: "Password is required and must be a string",
      },
      profileImageUrl: {
        bsonType: ["string", "null"],
        description: "Profile image URL can be string or null",
      },
      profileImagePublicId: {
        bsonType: ["string", "null"],
        description: "Public Id can be string or null",
      },
      role: {
        bsonType: "string",
        enum: ["admin", "member"],
        description: "Role can be admin OR member",
      },
      joinedAt: {
        bsonType: "date",
        description: "Joined At must be a date",
      },
      updatedAt: {
        bsonType: "date",
        description: "Updated At must be a date",
      },
    },
  },
};

export default UsersSchema;
