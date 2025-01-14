export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight to compare only the date part
  return date < today;
}