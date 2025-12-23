function getGreetings() {
  const now = new Date();

  const hours = now.getHours();

  if (hours >= 3 && hours < 12) return "Morning";
  else if (hours >= 12 && hours < 17) return "Afternoon";
  else return "Evening";
}

export default getGreetings;
