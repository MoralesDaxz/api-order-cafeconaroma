export const fetchDateMadrid = async () => {
  const URL_API = process.env.API_TIME_MADRID;
  try {
    const response = await fetch(URL_API);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const date = new Date(data.datetime);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // Formatear la hora
    const time = `${ hours + minutes}`;
    // Formatear la fecha
    const formattedDate = `${date.getFullYear()}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

    return { time, date: formattedDate };
  } catch (error) {
    console.error("Error fetching date and time:", error);
    throw new Error("Could not fetch the date and time from the API");
  }
};
