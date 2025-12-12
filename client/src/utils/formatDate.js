const locale = navigator.language;

function getOrdinal(n) {
  return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
}

function formatDate(date = new Date()) {
  const day = date.getDate();
  const dayName = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    date
  );
  const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
  const year = date.getFullYear();

  return `${dayName} ${day}${getOrdinal(day)} ${month}, ${year}`;
}

export default formatDate;
