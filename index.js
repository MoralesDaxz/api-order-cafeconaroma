import express from "express"; /* aplicar type:module linea 5 package.json */
import fs from "fs"; /* nos permite trabajar con archivos, incluido en NODE */
const app = express();

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
    fs.writeFileSync("./data/db-orders.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};
/* Bienvenida */
app.get("/", (req, res) => {
  res.send("Api de facturacion");
});
/* Ordenes */
app.get("/orders", (req, res) => {
  const data = readData();
   res.json(data);
});
/* Ordenes por id */
app.get("/orders/:id", (req, res) => {
    const data = readData();
    const id = req.params.id;
    const order = data.orders.find((item) => item.invoice == id)
    res.json(order)
  });
/* Crear orden */
  app.post("/orders", (req, res) => {
    const data = readData();
    const body = req.body;
    data.books.push(body);
    writeData(data);
    res.json(body);
  });