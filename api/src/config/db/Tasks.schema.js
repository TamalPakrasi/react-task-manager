const TasksSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["title", "dueDate", "todoCheckList"],
    properties: {
      title: {
        bsonType: "string",
        description: "Title is required and must be a string",
      },
      description: {
        bsonType: ["string", "null"],
        description: "Description can be string or null",
      },
      priority: {
        bsonType: "string",
        enum: ["Low", "Medium", "High"],
        description: "Priority must be Low, Medium or High",
      },
      status: {
        bsonType: "string",
        enum: ["Pending", "In Progress", "Completed"],
        description: "Status must be valid",
      },
      dueDate: {
        bsonType: "date",
        description: "Due Date is required and must be a date",
      },
      assignedTo: {
        bsonType: "objectId",
        description: "AssignedTo must be an ObjectId",
      },
      createdBy: {
        bsonType: "objectId",
        description: "CreatedBy must be an ObjectId",
      },
      attachments: {
        bsonType: "array",
        items: {
          bsonType: "string",
        },
        description: "Attachments must be array of strings",
      },
      todoCheckList: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["text"],
          properties: {
            text: {
              bsonType: "string",
              description: "Text is required",
            },
            completed: {
              bsonType: "bool",
              description: "Completed must be bool",
            },
          },
        },
      },
      progress: {
        bsonType: "number",
        description: "Progress must be number",
      },
      createdAt: {
        bsonType: "date",
        description: "Created At must be date",
      },
      updatedAt: {
        bsonType: "date",
        description: "Updated At must be date",
      },
    },
  },
};

export default TasksSchema;
