/**
 * Campus Study Hub API Documentation
 * This file defines the Swagger/OpenAPI specification for the API
 */

export const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Campus Study Hub API",
      version: "1.0.0",
      description: "API for managing study sessions and participants on campus",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://your-domain.com",
        description: "Production server",
      },
    ],
    tags: [
      { name: "Authentication", description: "User authentication endpoints" },
      { name: "Sessions", description: "Study session management" },
      { name: "Participants", description: "Session participant management" },
    ],
    paths: {
      "/api/auth/signup": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          description: "Create a new user account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "name", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "user@example.com",
                    },
                    name: {
                      type: "string",
                      example: "John Doe",
                    },
                    password: {
                      type: "string",
                      minLength: 6,
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          email: { type: "string" },
                          name: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request - missing or invalid fields",
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Login user",
          description: "Authenticate user and create session",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "user@example.com",
                    },
                    password: {
                      type: "string",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          email: { type: "string" },
                          name: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Unauthorized - invalid credentials",
            },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Authentication"],
          summary: "Get current user",
          description: "Retrieve authenticated user information",
          responses: {
            "200": {
              description: "Current user information",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          email: { type: "string" },
                          name: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Authentication"],
          summary: "Logout user",
          description: "Clear user session",
          responses: {
            "200": {
              description: "Logout successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/sessions": {
        get: {
          tags: ["Sessions"],
          summary: "Get upcoming sessions",
          description: "Retrieve all upcoming study sessions",
          responses: {
            "200": {
              description: "List of upcoming sessions",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        hostId: { type: "string" },
                        subject: { type: "string" },
                        tags: {
                          type: "array",
                          items: { type: "string" },
                        },
                        date: { type: "string", format: "date" },
                        startTime: { type: "string" },
                        endTime: { type: "string" },
                        capacity: { type: "number" },
                        location: {
                          type: "object",
                          properties: {
                            address: { type: "string" },
                            latitude: { type: "number" },
                            longitude: { type: "number" },
                          },
                        },
                        description: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
        post: {
          tags: ["Sessions"],
          summary: "Create a new session",
          description: "Create a new study session",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "hostId",
                    "subject",
                    "date",
                    "startTime",
                    "endTime",
                    "capacity",
                    "address",
                  ],
                  properties: {
                    hostId: {
                      type: "string",
                      description: "User ID of the host",
                    },
                    subject: {
                      type: "string",
                      example: "Linear Algebra",
                    },
                    tags: {
                      type: "array",
                      items: { type: "string" },
                      example: ["math", "linear-algebra"],
                    },
                    date: {
                      type: "string",
                      format: "date",
                      example: "2024-12-15",
                    },
                    startTime: {
                      type: "string",
                      example: "14:00",
                    },
                    endTime: {
                      type: "string",
                      example: "16:00",
                    },
                    capacity: {
                      type: "number",
                      example: 10,
                    },
                    address: {
                      type: "string",
                      example: "Campus Library, Room 201",
                    },
                    description: {
                      type: "string",
                      example: "Study session for final exam preparation",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Session created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      hostId: { type: "string" },
                      subject: { type: "string" },
                      tags: { type: "array", items: { type: "string" } },
                      date: { type: "string" },
                      startTime: { type: "string" },
                      endTime: { type: "string" },
                      capacity: { type: "number" },
                      location: { type: "object" },
                      description: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request - missing required fields",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/sessions/search": {
        get: {
          tags: ["Sessions"],
          summary: "Search sessions",
          description: "Search for sessions by various criteria",
          parameters: [
            {
              name: "query",
              in: "query",
              description: "Search query",
              required: false,
              schema: { type: "string" },
            },
            {
              name: "subject",
              in: "query",
              description: "Filter by subject",
              required: false,
              schema: { type: "string" },
            },
            {
              name: "tags",
              in: "query",
              description: "Filter by tags",
              required: false,
              schema: { type: "array", items: { type: "string" } },
            },
          ],
          responses: {
            "200": {
              description: "Search results",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        subject: { type: "string" },
                        tags: { type: "array", items: { type: "string" } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/sessions/{id}": {
        get: {
          tags: ["Sessions"],
          summary: "Get session details",
          description: "Get detailed information about a specific session",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Session ID",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Session details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      hostId: { type: "string" },
                      subject: { type: "string" },
                      tags: { type: "array", items: { type: "string" } },
                      date: { type: "string" },
                      startTime: { type: "string" },
                      endTime: { type: "string" },
                      capacity: { type: "number" },
                      location: { type: "object" },
                      description: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Sessions"],
          summary: "Delete a session",
          description: "Delete a specific session",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Session ID",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Session deleted successfully",
            },
            "404": {
              description: "Session not found",
            },
          },
        },
      },
      "/api/participants": {
        post: {
          tags: ["Participants"],
          summary: "Request to join a session",
          description: "Create a join request for a session",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["sessionId", "userId"],
                  properties: {
                    sessionId: {
                      type: "string",
                      description: "Session ID to join",
                    },
                    userId: {
                      type: "string",
                      description: "User ID requesting to join",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Join request created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      sessionId: { type: "string" },
                      userId: { type: "string" },
                      status: {
                        type: "string",
                        enum: ["pending", "accepted", "rejected"],
                      },
                      requestedAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request - missing fields or already requested",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/participants/{id}": {
        get: {
          tags: ["Participants"],
          summary: "Get participant details",
          description: "Get detailed information about a participant",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Participant ID",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Participant details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      sessionId: { type: "string" },
                      userId: { type: "string" },
                      status: { type: "string" },
                      requestedAt: { type: "string" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Participant not found",
            },
          },
        },
        patch: {
          tags: ["Participants"],
          summary: "Update participant status",
          description:
            "Update participant status (e.g., accept/reject join request)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Participant ID",
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "accepted", "rejected"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Participant updated",
            },
            "404": {
              description: "Participant not found",
            },
          },
        },
      },
      "/api/sessions/{id}/participants": {
        get: {
          tags: ["Sessions"],
          summary: "Get session participants",
          description: "Get all participants for a specific session",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Session ID",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "List of participants",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        userId: { type: "string" },
                        status: { type: "string" },
                        requestedAt: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "userId",
        },
      },
    },
  },
};
