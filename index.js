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
/* Ordenes por identity */
app.get("/identity/:id", (req, res) => {
  const data = readData();
  const id = req.params.id;
  const orders = data.orders.filter((item) => item.identity == id);
  res.json(orders);
});
/* Obtener longitud de ordenes para correlativo de factura */
app.get("/correlative", (req, res) => {
  const data = readData();
  return res.json({ value: data.orders.length });
});
/* Crear orden */
app.post("/new", (req, res) => {
  const data = readData();
  const body = req.body;
  const office = body.office
  const date = body.date
  const correlative = data.correlative + 1
  const newOrder = {
    order: correlative,
    invoice: office + date + correlative,
    ...body,
  };
try {
  data.correlative = correlative
  data.orders.unshift(newOrder);
  console.log(data.correlative);
  writeData(data);
  return res.json(newOrder);
  
} catch (error) {
  return res.send("Error al registrar datos de compra");
}
});
