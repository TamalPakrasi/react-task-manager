const RefreshTokensSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["userId", "token", "expiresAt"],
    properties: {
      userId: {
        bsonType: "objectId",
        description: "Reference to the user",
      },
      token: {
        bsonType: "string",
        description: "Hashed refresh token",
      },
      expiresAt: {
        bsonType: "date",
        description: "Token expiration date",
      },
      createdAt: {
        bsonType: "date",
        description: "Token creation date",
      },
      updatedAt: {
        bsonType: "date",
        description: "Token updation date",
      },
    },
  },
};

export default RefreshTokensSchema;
