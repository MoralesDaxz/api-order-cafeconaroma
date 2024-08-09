import fs from "fs";
const readData = () => {
  try {
    const data = fs.readFileSync("./data/db-orders.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};
/* Sobrescribe la data*/
const writeData = (data) => {
  try {
    fs.writeFileSync("./data/db-orders.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error, "No se grabaron los datos");
  }
};

export { readData, writeData };
