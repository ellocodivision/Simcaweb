"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography } from "@mui/material";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/nuevo_inventario.xlsx") // Cargar el archivo Excel
      .then((response) => response.blob()) // Convertirlo en Blob
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const workbook = XLSX.read(e.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0]; // Tomar la primera hoja
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet); // Convertir Excel a JSON
          setData(jsonData);
        };
        reader.readAsBinaryString(blob);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🏢 DESARROLLOS SIMCA - Inventario Online
      </Typography>

      {/* Tabla */}
      <DataGrid
        rows={data.map((row, index) => ({ id: index, ...row }))}
        columns={[
          { field: "UBICACIÓN", headerName: "Ubicación", flex: 1 },
          { field: "DESARROLLO", headerName: "Desarrollo", flex: 1 },
          { field: "UNIDAD", headerName: "Unidad", flex: 1 },
          { field: "RECAMARAS", headerName: "Recámaras", flex: 1 },
          { field: "PRECIO FINAL", headerName: "Precio Final", flex: 1 }
        ]}
        pageSize={10}
        autoHeight
      />
    </Container>
  );
}