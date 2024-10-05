interface IExercise {
  id: number;
  date: string;
  description: string;
  completed: boolean;
  function_abi: string;
  function_expected_return: string;
}

export type { IExercise };
