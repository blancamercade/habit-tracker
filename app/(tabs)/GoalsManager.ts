import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Goal {
  id: string;
  name: string;
  target: number;
  completed: number;
}

// Load goals from AsyncStorage
export const loadGoals = async (): Promise<Goal[]> => {
  try {
    const storedGoals = await AsyncStorage.getItem("goals");
    return storedGoals ? JSON.parse(storedGoals) : [];
  } catch (error) {
    console.error("Failed to load goals", error);
    return [];
  }
};

// Save goals to AsyncStorage
export const saveGoals = async (goals: Goal[]) => {
  try {
    await AsyncStorage.setItem("goals", JSON.stringify(goals));
  } catch (error) {
    console.error("Failed to save goals", error);
  }
};

// Add a new goal
export const addGoal = async (goals: Goal[], newGoalName: string, newGoalTarget: string, setGoals: React.Dispatch<React.SetStateAction<Goal[]>>) => {
  if (!newGoalName || !newGoalTarget) return;

  const newGoal: Goal = {
    id: Math.random().toString(),
    name: newGoalName,
    target: parseInt(newGoalTarget),
    completed: 0,
  };

  const updatedGoals = [...goals, newGoal];
  setGoals(updatedGoals);
  await saveGoals(updatedGoals);
};

// Delete a goal
export const deleteGoal = async (id: string, goals: Goal[], setGoals: React.Dispatch<React.SetStateAction<Goal[]>>) => {
  const updatedGoals = goals.filter((goal) => goal.id !== id);
  setGoals(updatedGoals);
  await saveGoals(updatedGoals);
};

// Update goal progress
export const updateProgress = async (id: string, amount: number, goals: Goal[], setGoals: React.Dispatch<React.SetStateAction<Goal[]>>) => {
  const updatedGoals = goals.map((goal) =>
    goal.id === id ? { ...goal, completed: Math.min(goal.completed + amount, goal.target) } : goal
  );
  setGoals(updatedGoals);
  await saveGoals(updatedGoals);
};
