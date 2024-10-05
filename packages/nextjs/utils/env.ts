// utils/env.ts

export function getEnvVariable(key: string, defaultValue: string | undefined = undefined, required = true): string {
  let value = process.env[key];

  if (required && typeof defaultValue === "undefined" && (!value || value.trim() === "")) {
    throw new Error(`Environment variable ${key} is not set or is empty`);
  }

  if (!required && (!value || value?.trim() === "") && typeof defaultValue !== "undefined") {
    value = defaultValue;
  }

  if (typeof value === "string") {
    return value;
  }

  throw new Error(`Environment variable ${key}. Setting a value for, something is not right`);
}
