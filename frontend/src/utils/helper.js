export const convertTime = (journalDate) => {
  const date = new Date(journalDate);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const hour = date.getHours() % 12 || 12;
  const minute = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  const time = `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;

  return time;
};
