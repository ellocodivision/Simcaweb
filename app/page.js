"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography } from "@mui/material";
import "./globals.css"; // ✅ Importa estilos correctamente

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

          // ✅ Convertir datos asegurando que nunca sean undefined o NaN
          const formattedData = jsonData.map((row, index) => ({
            id: index,
            ...row,
            precioListaNum: row["PRECIO DE LISTA"]
              ? parseInt(row["PRECIO DE LISTA"].toString().replace(/[$,]/g, "")) || 0
              : 0,
            descuentoNum: row["DESCUENTO $"]
              ? parseInt(row["DESCUENTO $"].toString().replace(/[$,]/g, "")) || 0
              : 0,
            precioFinalNum: row["PRECIO FINAL"]
              ? parseInt(row["PRECIO FINAL"].toString().replace(/[$,]/g, "")) || 0
              : 0,
          }));

          setData(formattedData);
        };
        reader.readAsBinaryString(blob);
      });
  }, []);

  // ✅ Asegurar que los valores siempre existen
  const safeGetter = (params, field) => params?.row?.[field] ?? 0;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🏢 DESARROLLOS SIMCA - Inventario Online
      </Typography>

      {/* Tabla */}
      <DataGrid
        rows={data}
        columns={[
          { field: "DESARROLLO", headerName: "Desarrollo", flex: 1 },
          { field: "UNIDAD", headerName: "Unidad", flex: 1 },
          { field: "RECAMARAS", headerName: "Recámaras", flex: 1 },
          {
            field: "PRECIO DE LISTA",
            headerName: "Precio de Lista",
            flex: 1,
            sortComparator: (a, b) => a - b,
            valueGetter: (params) => safeGetter(params, "precioListaNum"),
            renderCell: (params) =>
              params.row ? `$${safeGetter(params, "precioListaNum").toLocaleString()}` : "",
          },
          {
            field: "DESCUENTO %",
            headerName: "Descuento %",
            flex: 1,
          },
          {
            field: "DESCUENTO $",
            headerName: "Descuento $",
            flex: 1,
            sortComparator: (a, b) => a - b,
            valueGetter: (params) => safeGetter(params, "descuentoNum"),
            renderCell: (params) =>
              params.row ? `$${safeGetter(params, "descuentoNum").toLocaleString()}` : "",
          },
          {
            field: "PRECIO FINAL",
            headerName: "Precio Final",
            flex: 1,
            sortComparator: (a, b) => a - b,
            valueGetter: (params) => safeGetter(params, "precioFinalNum"),
            renderCell: (params) =>
              params.row ? `$${safeGetter(params, "precioFinalNum").toLocaleString()}` : "",
          },
          { field: "UBICACIÓN", headerName: "Ubicación", flex: 1 }, // Última columna
        ]}
        pageSize={10}
        autoHeight
      />
    </Container>
  );
}