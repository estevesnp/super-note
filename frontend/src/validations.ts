export type Validation = {
  valid: boolean;
  error?: string;
};

export function validateInput(input: string, min = 1, max = 50): Validation {
  if (!input) {
    return { valid: false, error: "input is empty" };
  }

  if (input.length < min) {
    return {
      valid: false,
      error: `too short: min lenght is ${min}, got ${input.length}`,
    };
  }

  if (input.length > max) {
    return {
      valid: false,
      error: `too short: max lenght is ${max}, got ${input.length}`,
    };
  }

  return { valid: true };
}
