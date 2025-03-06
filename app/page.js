"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography } from "@mui/material";
import "./globals.css"; // ✅ Asegurar que este archivo exista

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/nuevo_inventario.xlsx")
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const workbook = XLSX.read(e.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          // ✅ Formateamos los datos para evitar errores
          const formattedData = jsonData.map((row, index) => ({
            id: index,
            desarrollo: row["DESARROLLO"] || "",
            unidad: row["UNIDAD"] || "",
            recamaras: row["RECAMARAS"] || "",
            ubicacion: row["UBICACIÓN"] || "",
            precioLista: Number(row["PRECIO DE LISTA"]?.toString().replace(/[$,]/g, "")) || 0,
            descuentoPorcentaje: row["DESCUENTO %"]
              ? Math.round(Number(row["DESCUENTO %"]) * (row["DESCUENTO %"] < 1 ? 100 : 1))
              : 0,
            descuentoDinero: Number(row["DESCUENTO $"]?.toString().replace(/[$,]/g, "")) || 0,
            precioFinal: Number(row["PRECIO FINAL"]?.toString().replace(/[$,]/g, "")) || 0,
          }));

          setData(formattedData);
        };
        reader.readAsBinaryString(blob);
      })
      .catch((error) => console.error("Error cargando el archivo:", error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🏢 DESARROLLOS SIMCA - Inventario Online
      </Typography>

      {/* Tabla */}
      <DataGrid
        rows={data}
        columns={[
          { field: "desarrollo", headerName: "Desarrollo", flex: 1 },
          { field: "unidad", headerName: "Unidad", flex: 1 },
          { field: "recamaras", headerName: "Recámaras", flex: 1 },
          {
            field: "precioLista",
            headerName: "Precio de Lista",
            flex: 1,
            type: "number",
            renderCell: (params) =>
              params.value ? `$${params.value.toLocaleString()}` : "",
          },
          {
            field: "descuentoPorcentaje",
            headerName: "Descuento %",
            flex: 1,
            type: "number",
            renderCell: (params) =>
              params.value !== undefined ? `${params.value}%` : "",
          },
          {
            field: "descuentoDinero",
            headerName: "Descuento $",
            flex: 1,
            type: "number",
            renderCell: (params) =>
              params.value ? `$${params.value.toLocaleString()}` : "",
          },
          {
            field: "precioFinal",
            headerName: "Precio Final",
            flex: 1,
            type: "number",
            renderCell: (params) =>
              params.value ? `$${params.value.toLocaleString()}` : "",
          },
          { field: "ubicacion", headerName: "Ubicación", flex: 1 },
        ]}
        pageSize={10}
        autoHeight
      />
    </Container>
  );
}