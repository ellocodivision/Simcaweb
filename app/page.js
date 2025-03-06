"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Select, MenuItem } from "@mui/material";

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

          // ✅ Aplicar formato y manejar valores vacíos correctamente
          const formattedData = jsonData.map((row, index) => ({
            id: index,
            ...row,
            "PRECIO DE LISTA": row["PRECIO DE LISTA"] != null ? `$${parseInt(row["PRECIO DE LISTA"]).toLocaleString()}` : "",
            "DESCUENTO %": row["DESCUENTO %"] != null ? `${parseInt(row["DESCUENTO %"])}%` : "",
            "DESCUENTO $": row["DESCUENTO $"] != null ? `$${parseInt(row["DESCUENTO $"]).toLocaleString()}` : "",
            "PRECIO FINAL": row["PRECIO FINAL"] != null ? `$${parseInt(row["PRECIO FINAL"]).toLocaleString()}` : ""
          }));

          setData(formattedData);
        };
        reader.readAsBinaryString(blob);
      });
  }, []);

  // Definir rangos de precios
  const priceRanges = {
    "Todos": [0, Infinity],
    "Hasta 200k": [0, 200000],
    "200k - 300k": [200000, 300000],
    "300k - 400k": [300000, 400000],
    "400k - 600k": [400000, 600000],
    "Más de 600k": [600000, Infinity]
  };

  // Definir orden fijo para Recámaras
  const recamarasOrdenadas = ["Studio", "Loft", "1", "2", "3", "4"];

  // Filtrar datos según selecciones
  const filteredData = data.filter((row) => {
    return (
      (ubicacion === "" || row.UBICACIÓN === ubicacion) &&
      (desarrollo === "" || row.DESARROLLO === desarrollo) &&
      (recamaras === "" || row.RECAMARAS.toString() === recamaras) &&
      (row["PRECIO FINAL"].replace("$", "").replace(",", "") >= priceRanges[precioFinal][0] && row["PRECIO FINAL"].replace("$", "").replace(",", "") <= priceRanges[precioFinal][1])
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
          <MenuItem value="">Filtrar por Ubicación</MenuItem>
          {Array.from(new Set(data.map((d) => d.UBICACIÓN))).map((u) => (
            <MenuItem key={u} value={u}>{u}</MenuItem>
          ))}
        </Select>

        <Select value={desarrollo} onChange={(e) => setDesarrollo(e.target.value)} displayEmpty>
          <MenuItem value="">Filtrar por Desarrollo</MenuItem>
          {Array.from(new Set(data.map((d) => d.DESARROLLO))).map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </Select>

        <Select value={recamaras} onChange={(e) => setRecamaras(e.target.value)} displayEmpty>
          <MenuItem value="">Filtrar por Recámaras</MenuItem>
          {recamarasOrdenadas.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </Select>

        <Select value={precioFinal} onChange={(e) => setPrecioFinal(e.target.value)} displayEmpty>
          {Object.keys(priceRanges).map((range) => (
            <MenuItem key={range} value={range}>{range}</MenuItem>
          ))}
        </Select>
      </div>

      {/* Tabla */}
      <DataGrid
        rows={filteredData.map((row, index) => ({ id: index, ...row }))}
        columns={[
          { field: "DESARROLLO", headerName: "Desarrollo", flex: 1 },
          { field: "UNIDAD", headerName: "Unidad", flex: 1 },
          { field: "RECAMARAS", headerName: "Recámaras", flex: 1 },
          { field: "PRECIO DE LISTA", headerName: "Precio de Lista", flex: 1 },
          { field: "DESCUENTO %", headerName: "Descuento %", flex: 1 },
          { field: "DESCUENTO $", headerName: "Descuento $", flex: 1 },
          { field: "PRECIO FINAL", headerName: "Precio Final", flex: 1 },
          { field: "UBICACIÓN", headerName: "Ubicación", flex: 1 } // Última columna
        ]}
        pageSize={10}
        autoHeight
      />
    </Container>
  );
}