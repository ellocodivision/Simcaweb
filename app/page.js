"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import "./globals.css"; // ✅ Importa los estilos correctamente

export default function Home() {
  const [data, setData] = useState([]);
  const [ubicacion, setUbicacion] = useState("");
  const [desarrollo, setDesarrollo] = useState("");
  const [recamaras, setRecamaras] = useState("");
  const [precioFinal, setPrecioFinal] = useState("Todos");

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

          // ✅ Convertir datos y validar valores para evitar undefined
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

  // ✅ Ordenación correcta de valores numéricos
  const sortComparator = (a, b) => a - b;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🏢 DESARROLLOS SIMCA - Inventario Online
      </Typography>

      {/* Tabla */}
      <DataGrid
        rows={data.map((row, index) => ({ id: index, ...row }))}
        columns={[
          { field: "DESARROLLO", headerName: "Desarrollo", flex: 1 },
          { field: "UNIDAD", headerName: "Unidad", flex: 1 },
          { field: "RECAMARAS", headerName: "Recámaras", flex: 1 },
          {
            field: "PRECIO DE LISTA",
            headerName: "Precio de Lista",
            flex: 1,
            sortComparator, // ✅ Ordena correctamente por número
            valueGetter: (params) => params.row?.precioListaNum ?? 0, // ✅ Si es undefined, poner 0
            renderCell: (params) => `$${(params.row?.precioListaNum || 0).toLocaleString()}`,
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
            sortComparator, // ✅ Ordena correctamente por número
            valueGetter: (params) => params.row?.descuentoNum ?? 0,
            renderCell: (params) => `$${(params.row?.descuentoNum || 0).toLocaleString()}`,
          },
          {
            field: "PRECIO FINAL",
            headerName: "Precio Final",
            flex: 1,
            sortComparator, // ✅ Ordena correctamente por número
            valueGetter: (params) => params.row?.precioFinalNum ?? 0,
            renderCell: (params) => `$${(params.row?.precioFinalNum || 0).toLocaleString()}`,
          },
          { field: "UBICACIÓN", headerName: "Ubicación", flex: 1 }, // Última columna
        ]}
        pageSize={10}
        autoHeight
      />
    </Container>
  );
}