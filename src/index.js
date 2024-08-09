import express from "express"; /* aplicar type:module linea 5 package.json */
import cors from "cors";
import dotenv from 'dotenv';
import { fetchDateMadrid } from "./utils/fetchDate.js";
import { readData, writeData } from "./utils/fileUtils.js";

dotenv.config();
const corsOptions = {
  origin: ["http://localhost:3000", "https://cafeconaroma.vercel.app"], // Orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  optionsSuccessStatus: 200 // Para navegadores legacy
};
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors(corsOptions));
app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto ", PORT);
}); /* Levantamos servidor */

/* Bienvenida */
app.get("/", (req, res) => {
  res.send("API - Manejo de Ordenes de compra");
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
app.post("/new", async (req, res) => {
  try {
    const data = readData();
    const body = req.body;
    const date = req.body.date
    const office = "E001";
    const correlative = data.correlative + 1;
    const newOrder = {
      order: correlative,
      invoice: office + date + correlative,
         ...body,
    };

    data.correlative = correlative;
    data.orders.unshift(newOrder);
    writeData(data);
    return res.json(newOrder);
  } catch (error) {
    console.error("Error creating new order:", error);
    return res.status(500).send("Error al registrar datos de compra");
  }
});
