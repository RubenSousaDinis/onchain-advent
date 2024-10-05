interface IExercise {
  id: number;
  date: Date;
  description: string;
  completed: boolean;
  function_abi: string;
  function_expected_return: string;
  total_rewards: number;
}

export type { IExercise };
