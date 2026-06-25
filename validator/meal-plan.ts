import validator from "./index";

const mealPlanSchema = {
  packageId: { type: "string", empty: false },
  title: { type: "string", empty: false, min: 3 },
  description: { type: "string", optional: true },
  isActive: { type: "boolean", optional: true },
  breakfast: {
    type: "array",
    optional: true,
    items: {
      type: "object",
      props: {
        foodId: { type: "string", empty: false },
        quantity: { type: "number", positive: true },
        unit: { type: "string", optional: true },
      },
    },
  },
  lunch: {
    type: "array",
    optional: true,
    items: {
      type: "object",
      props: {
        foodId: { type: "string", empty: false },
        quantity: { type: "number", positive: true },
        unit: { type: "string", optional: true },
      },
    },
  },
  dinner: {
    type: "array",
    optional: true,
    items: {
      type: "object",
      props: {
        foodId: { type: "string", empty: false },
        quantity: { type: "number", positive: true },
        unit: { type: "string", optional: true },
      },
    },
  },
  snack: {
    type: "array",
    optional: true,
    items: {
      type: "object",
      props: {
        foodId: { type: "string", empty: false },
        quantity: { type: "number", positive: true },
        unit: { type: "string", optional: true },
      },
    },
  },
};

const mealPlanUpdateSchema = {
  ...mealPlanSchema,
  packageId: { type: "string", empty: false, optional: true },
  title: { type: "string", empty: false, min: 3, optional: true },
};

export const validateMealPlan = validator.compile(mealPlanSchema);
export const validateMealPlanUpdate = validator.compile(mealPlanUpdateSchema);
