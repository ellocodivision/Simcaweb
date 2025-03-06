"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import "./globals.css"; // ✅ Asegurar que el archivo exista

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [ubicacionFilter, setUbicacionFilter] = useState("Todos");
  const [desarrolloFilter, setDesarrolloFilter] = useState("Todos");
  const [recamarasFilter, setRecamarasFilter] = useState("Todos");
  const [precioFilter, setPrecioFilter] = useState("Todos");

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
          setFilteredData(formattedData);
        };
        reader.readAsBinaryString(blob);
      })
      .catch((error) => console.error("Error cargando el archivo:", error));
  }, []);

  // 📌 Filtrado de datos
  useEffect(() => {
    let filtered = data;

    if (ubicacionFilter !== "Todos") {
      filtered = filtered.filter((row) => row.ubicacion === ubicacionFilter);
    }
    if (desarrolloFilter !== "Todos") {
      filtered = filtered.filter((row) => row.desarrollo === desarrolloFilter);
    }
    if (recamarasFilter !== "Todos") {
      filtered = filtered.filter((row) => row.recamaras === recamarasFilter);
    }
    if (precioFilter !== "Todos") {
      const priceRanges = {
        "Hasta 200k": [0, 200000],
        "200k - 300k": [200000, 300000],
        "300k - 400k": [300000, 400000],
        "400k - 600k": [400000, 600000],
        "Más de 600k": [600000, Infinity],
      };
      filtered = filtered.filter(
        (row) =>
          row.precioFinal >= priceRanges[precioFilter][0] &&
          row.precioFinal <= priceRanges[precioFilter][1]
      );
    }

    setFilteredData(filtered);
  }, [ubicacionFilter, desarrolloFilter, recamarasFilter, precioFilter, data]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🏢 DESARROLLOS SIMCA - Inventario Online
      </Typography>

      {/* Filtros */}
      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>Filtrar por Ubicación</InputLabel>
        <Select value={ubicacionFilter} onChange={(e) => setUbicacionFilter(e.target.value)}>
          <MenuItem value="Todos">Todos</MenuItem>
          {[...new Set(data.map((row) => row.ubicacion))].map((ubicacion) => (
            <MenuItem key={ubicacion} value={ubicacion}>
              {ubicacion}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>Filtrar por Desarrollo</InputLabel>
        <Select value={desarrolloFilter} onChange={(e) => setDesarrolloFilter(e.target.value)}>
          <MenuItem value="Todos">Todos</MenuItem>
          {[...new Set(data.map((row) => row.desarrollo))].map((desarrollo) => (
            <MenuItem key={desarrollo} value={desarrollo}>
              {desarrollo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>Filtrar por Recámaras</InputLabel>
        <Select value={recamarasFilter} onChange={(e) => setRecamarasFilter(e.target.value)}>
          <MenuItem value="Todos">Todos</MenuItem>
          {["Studio", "Loft", "1", "2", "3", "4"].map((rec) => (
            <MenuItem key={rec} value={rec}>
              {rec}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>Filtrar por Precio Final</InputLabel>
        <Select value={precioFilter} onChange={(e) => setPrecioFilter(e.target.value)}>
          <MenuItem value="Todos">Todos</MenuItem>
          {["Hasta 200k", "200k - 300k", "300k - 400k", "400k - 600k", "Más de 600k"].map(
            (precio) => (
              <MenuItem key={precio} value={precio}>
                {precio}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      {/* Tabla */}
      <DataGrid
        rows={filteredData}
        columns={[
          { field: "desarrollo", headerName: "Desarrollo", flex: 1 },
          { field: "unidad", headerName: "Unidad", flex: 1 },
          { field: "recamaras", headerName: "Recámaras", flex: 1 },
          {
            field: "precioLista",
            headerName: "Precio de Lista",
            flex: 1,
            type: "number",
            renderCell: (params) => `$${params.value.toFixed(2).toLocaleString()}`,
          },
          {
            field: "descuentoPorcentaje",
            headerName: "Descuento %",
            flex: 1,
            type: "number",
            renderCell: (params) => `${params.value.toFixed(2)}%`,
          },
          {
            field: "descuentoDinero",
            headerName: "Descuento $",
            flex: 1,
            type: "number",
            renderCell: (params) => `$${params.value.toFixed(2).toLocaleString()}`,
          },
          {
            field: "precioFinal",
            headerName: "Precio Final",
            flex: 1,
            type: "number",
            renderCell: (params) => `$${params.value.toFixed(2).toLocaleString()}`,
          },
          { field: "ubicacion", headerName: "Ubicación", flex: 1 },
        ]}
        pageSize={10}
        autoHeight
      />
    </Container>
  );
}