"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import * as XLSX from "xlsx"; // Importar la librería para leer Excel

export default function Home() {
  const [data, setData] = useState([]);
  const [ubicacion, setUbicacion] = useState("");
  const [desarrollo, setDesarrollo] = useState("");
  const [recamaras, setRecamaras] = useState("");

  useEffect(() => {
    fetch("/data/inventario.xlsx") // Cargar el archivo Excel
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

  const filteredData = data.filter((row) => {
    return (
      (ubicacion === "" || row.UBICACIÓN === ubicacion) &&
      (desarrollo === "" || row.DESARROLLO === desarrollo) &&
      (recamaras === "" || row.RECAMARAS === recamaras)
    );
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🏢 DESARROLLOS SIMCA - Inventario Online
      </Typography>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Select value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} displayEmpty>
          <MenuItem value="">Todos</MenuItem>
          {Array.from(new Set(data.map((d) => d.UBICACIÓN))).map((u) => (
            <MenuItem key={u} value={u}>{u}</MenuItem>
          ))}
        </Select>

        <Select value={desarrollo} onChange={(e) => setDesarrollo(e.target.value)} displayEmpty>
          <MenuItem value="">Todos</MenuItem>
          {Array.from(new Set(data.map((d) => d.DESARROLLO))).map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </Select>

        <Select value={recamaras} onChange={(e) => setRecamaras(e.target.value)} displayEmpty>
          <MenuItem value="">Todos</MenuItem>
          {Array.from(new Set(data.map((d) => d.RECAMARAS))).map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </Select>
      </div>

      {/* Tabla */}
      <DataGrid rows={filteredData} columns={[
        { field: "UBICACIÓN", headerName: "Ubicación", flex: 1 },
        { field: "DESARROLLO", headerName: "Desarrollo", flex: 1 },
        { field: "UNIDAD", headerName: "Unidad", flex: 1 },
        { field: "RECAMARAS", headerName: "Recámaras", flex: 1 },
        { field: "PRECIO FINAL", headerName: "Precio Final", flex: 1 }
      ]} pageSize={10} autoHeight />
    </Container>
  );
}