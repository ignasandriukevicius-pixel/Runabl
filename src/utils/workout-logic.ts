export type WorkoutStatus = 'planned' | 'completed' | 'missed';

export function getWorkoutStatus(plannedDate: string, isCompleted: boolean): WorkoutStatus {
  if (isCompleted) return 'completed';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const workoutDate = new Date(plannedDate);
  workoutDate.setHours(0, 0, 0, 0);

  if (workoutDate < today) {
    return 'missed';
  }
  
  return 'planned';
}
