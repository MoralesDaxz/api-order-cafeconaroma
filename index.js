import express from "express"; /* aplicar type:module linea 5 package.json */
import fs from "fs"; /* nos permite trabajar con archivos, incluido en NODE */
const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
}); /* Levantamos servidor */

/* leemos datos y pasamos a JSON para enviarlos */
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

const fetchMadridDateTime = async () => {
  /* process.env.NEXT_PUBLIC_URL_API_TIME*/
  const URL_API = "http://worldtimeapi.org/api/timezone/Europe/Madrid";
  try {
    const response = await fetch(URL_API);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return new Date(data.datetime);
  } catch (error) {
    console.error("Error fetching date:", error);
    throw new Error("Could not fetch the date from the API");
  }
};
const generateInvoiceCode = async (correlative, office) => {
  try {
    const formattedDate = formatDate();
    const invoiceCode = `${office}${formattedDate}-${correlative}`;
    return invoiceCode;
  } catch (error) {
    console.error("Error generating invoice code:", error);
    throw new Error("Could not generate the invoice code");
  }
};

const formatDate = async () => {
  const date = await fetchMadridDateTime();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const getCurrentTimeIn24HourFormat = async () => {
  try {
    const date = await fetchMadridDateTime();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error fetching time:", error);
    throw new Error("Could not fetch the time");
  }
};

// Ejemplo de uso para el código de factura
export const generateNewInvoiceCode = async (correlative, office) => {
  // Este valor debe ser dinámico en una implementación real
  const invoiceCode = await generateInvoiceCode(correlative, office);
  return invoiceCode;
};

// Ejemplo de uso para la hora en formato 24 horas
export const displayCurrentTime = async () => {
  const currentTime = await getCurrentTimeIn24HourFormat();
  return currentTime;
};

/* Bienvenida */
app.get("/", (req, res) => {
  res.send("Api de facturacion");
});
/* Ordenes - detalladamente todas las ordenes*/
app.get("/orders", (req, res) => {
  const data = readData();
  res.json(data);
});
/* Ordenes por id */
app.get("/orders/:id", (req, res) => {
  const data = readData();
  const id = req.params.id;
  const order = data.orders.find((item) => item.invoice == id);
  res.json(order);
});
/* Obtener longitud de ordenes para correlativo de factura */
app.get("/correlative", (req, res) => {
  const data = readData();
  return res.json({ value: data.orders.length });
});

/* Crear orden */
app.post("/orders", (req, res) => {
  const data = readData();
  const body = req.body;
  const newOrder = {
    order: data.orders.length + 1,
    ...body,
  };
  data.orders.unshift(newOrder);
  writeData(data);
  return res.json(newOrder);
});
