import { Tool } from '@anthropic-ai/sdk/resources/messages.mjs';

export const tools: Tool[] = [
  {
    name: "create_operations",
    description: "Extract and create life area operations from user input",
    input_schema: {
      type: "object",
      properties: {
        operations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Operation name (e.g., Career Development)" },
              description: { type: "string", description: "Brief description" }
            },
            required: ["name", "description"]
          }
        }
      },
      required: ["operations"]
    }
  },
  {
    name: "create_goals",
    description: "Extract and create goals for an operation",
    input_schema: {
      type: "object",
      properties: {
        operation_name: { type: "string" },
        goals: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              goal_type: { type: "string", enum: ["subgoal_based", "metric_based"] },
              subgoals: { type: "array", items: { type: "string" } }
            },
            required: ["title", "goal_type"]
          }
        }
      },
      required: ["operation_name", "goals"]
    }
  },
  {
    name: "create_habits",
    description: "Extract and create daily habits",
    input_schema: {
      type: "object",
      properties: {
        habits: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              linked_operation: { type: "string" }
            },
            required: ["name"]
          }
        }
      },
      required: ["habits"]
    }
  },
  {
    name: "create_metrics",
    description: "Extract and create numeric metrics to track",
    input_schema: {
      type: "object",
      properties: {
        metrics: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              unit: { type: "string" },
              optimal_value: { type: "number" },
              minimum_value: { type: "number" },
              operator: { type: "string", enum: ["at_least", "at_most", "exactly"] },
              linked_operation: { type: "string" }
            },
            required: ["name", "unit", "optimal_value", "minimum_value", "operator"]
          }
        }
      },
      required: ["metrics"]
    }
  },
  {
    name: "generate_full_system",
    description: "Generate complete life operating system from user's main goals",
    input_schema: {
      type: "object",
      properties: {
        operations: {
          type: "array",
          description: "2-4 core life areas/pillars",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Operation name (e.g., 'Physical Health')" },
              description: { type: "string", description: "Brief description" },
              linked_goals: {
                type: "array",
                items: { type: "string" },
                description: "Which of the user's goals this operation addresses"
              }
            },
            required: ["name", "description", "linked_goals"]
          }
        },
        habits: {
          type: "array",
          description: "3-8 daily boolean habits that support the goals",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Habit name (e.g., 'Morning Workout')" },
              linked_operation: { type: "string", description: "Which operation this habit supports" },
              reasoning: { type: "string", description: "Why this habit matters for the goals" }
            },
            required: ["name", "linked_operation", "reasoning"]
          }
        },
        metrics: {
          type: "array",
          description: "2-6 numeric measurements to track progress",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              unit: { type: "string" },
              optimal_value: { type: "number" },
              minimum_value: { type: "number" },
              operator: { type: "string", enum: ["at_least", "at_most", "exactly"] },
              linked_operation: { type: "string" },
              reasoning: { type: "string", description: "Why tracking this matters" }
            },
            required: ["name", "unit", "optimal_value", "minimum_value", "operator", "linked_operation", "reasoning"]
          }
        },
        schedule: {
          type: "object",
          description: "Recommended wake and sleep times",
          properties: {
            wakeHour: { type: "number", minimum: 0, maximum: 23 },
            sleepHour: { type: "number", minimum: 0, maximum: 23 },
            reasoning: { type: "string", description: "Why these times support the goals" }
          },
          required: ["wakeHour", "sleepHour", "reasoning"]
        }
      },
      required: ["operations", "habits", "metrics", "schedule"]
    }
  }
];
