"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [desarrollos, setDesarrollos] = useState([]);
  const [recamaras, setRecamaras] = useState([]);
  const [selectedUbicacion, setSelectedUbicacion] = useState("Todos");
  const [selectedDesarrollo, setSelectedDesarrollo] = useState("Todos");
  const [selectedRecamaras, setSelectedRecamaras] = useState("Todos");

  useEffect(() => {
    fetch("/data/inventario.json")
      .then((response) => response.json())
      .then((jsonData) => {
        const formattedData = jsonData.map((row, index) => ({
          id: index,
          ...row,
          precioListaNum: Number(row["PRECIO DE LISTA"].replace(/[^0-9.-]+/g, "")),
          descuentoNum: Number(row["DESCUENTO $"].replace(/[^0-9.-]+/g, "")),
          precioFinalNum: Number(row["PRECIO FINAL"].replace(/[^0-9.-]+/g, ""))
        }));

        setData(formattedData);
        setFilteredData(formattedData);

        setUbicaciones(["Todos", ...new Set(formattedData.map((item) => item["UBICACIÓN"]))]);
        setDesarrollos(["Todos", ...new Set(formattedData.map((item) => item["DESARROLLO"]))]);
        setRecamaras(["Todos", "STUDIO", "LOFT", "1", "2", "3", "4"]);
      });
  }, []);

  useEffect(() => {
    let filtered = data;

    if (selectedUbicacion !== "Todos") {
      filtered = filtered.filter((item) => item["UBICACIÓN"] === selectedUbicacion);
    }

    if (selectedDesarrollo !== "Todos") {
      filtered = filtered.filter((item) => item["DESARROLLO"] === selectedDesarrollo);
    }

    if (selectedRecamaras !== "Todos") {
      filtered = filtered.filter((item) => item["RECAMARAS"] === selectedRecamaras);
    }

    setFilteredData(filtered);
  }, [selectedUbicacion, selectedDesarrollo, selectedRecamaras, data]);

  const handleResetFilters = () => {
    setSelectedUbicacion("Todos");
    setSelectedDesarrollo("Todos");
    setSelectedRecamaras("Todos");
  };

  const columns = [
    { field: "DESARROLLO", headerName: "Desarrollo", flex: 1 },
    { field: "UNIDAD", headerName: "Unidad", flex: 1 },
    { field: "RECAMARAS", headerName: "Recámaras", flex: 1 },
    { field: "PRECIO DE LISTA", headerName: "Precio de Lista", flex: 1, valueGetter: (params) => `$${params.row.precioListaNum.toLocaleString()}` },
    { field: "DESCUENTO %", headerName: "Descuento %", flex: 1, valueGetter: (params) => `${params.row["DESCUENTO %"] || ""}%` },
    { field: "DESCUENTO $", headerName: "Descuento $", flex: 1, valueGetter: (params) => params.row.descuentoNum ? `$${params.row.descuentoNum.toLocaleString()}` : "" },
    { field: "PRECIO FINAL", headerName: "Precio Final", flex: 1, valueGetter: (params) => params.row.precioFinalNum ? `$${params.row.precioFinalNum.toLocaleString()}` : "" },
    { field: "UBICACIÓN", headerName: "Ubicación", flex: 1 }
  ];

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        🏢 DESARROLLOS SIMCA - Inventario Online
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Filtrar por Ubicación</InputLabel>
        <Select value={selectedUbicacion} onChange={(e) => setSelectedUbicacion(e.target.value)}>
          {ubicaciones.map((ubicacion) => (
            <MenuItem key={ubicacion} value={ubicacion}>
              {ubicacion}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Filtrar por Desarrollo</InputLabel>
        <Select value={selectedDesarrollo} onChange={(e) => setSelectedDesarrollo(e.target.value)}>
          {desarrollos.map((desarrollo) => (
            <MenuItem key={desarrollo} value={desarrollo}>
              {desarrollo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Filtrar por Recámaras</InputLabel>
        <Select value={selectedRecamaras} onChange={(e) => setSelectedRecamaras(e.target.value)}>
          {recamaras.map((rec) => (
            <MenuItem key={rec} value={rec}>
              {rec}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="secondary" onClick={handleResetFilters} style={{ marginBottom: "10px" }}>
        Quitar filtros
      </Button>

      <DataGrid rows={filteredData} columns={columns} autoHeight pageSizeOptions={[10, 25, 50, 100]} />

      {/* Sección de Enlaces */}
      <Typography variant="h5" style={{ marginTop: "20px" }}>📍 PLAYA DEL CARMEN</Typography>
      <Typography>
        <a href="https://drive.google.com/drive/folders/1wLmmckCcHJZpo4epx1wOL9y29ZVr1CRW?usp=drive_link">Ceiba - Drive</a><br />
        <a href="https://drive.google.com/drive/folders/1iZ6IGvc9g-N9bdQ62N7_XKWxtSWtEmHW?usp=drive_link">Cruz con Mar - Drive</a><br />
        <a href="https://drive.google.com/drive/folders/1iYveTUNluxpXMXIzNkrTM1DotXeb_y2D?usp=drive_link">Ipana - Drive</a><br />
        <a href="https://drive.google.com/drive/folders/12yciY02hANBw9m6bk80IeA9pLeAyNZtt?usp=drive_link">Maresol - Drive</a><br />
      </Typography>

      <Typography variant="h5" style={{ marginTop: "20px" }}>📍 TULUM</Typography>
      <Typography>
        <a href="https://drive.google.com/drive/folders/1Ka-9_TXx8hbKDNrtYM1A5iYCqvYyeNbI?usp=drive_link">Costa Caribe - Drive</a><br />
        <a href="https://drive.google.com/drive/folders/1HMDG7UBljBe9GwYwtvW8ZjmJpwylTca5?usp=drive_link">Gran Tulum - Drive</a><br />
        <a href="https://drive.google.com/drive/folders/1CX-qEyXVi_RqmRoeFl-Tq0sVNfKEUtrw?usp=drive_link">Natal - Drive</a><br />
      </Typography>

      <Typography variant="h5" style={{ marginTop: "20px" }}>📞 Contacto</Typography>
      <Typography>
        <a href="https://drive.google.com/file/d/1xzsKBinrBmRFkbZf0_L_rFIPr4FfRgx9/view?usp=drive_link">CONTACTO</a>
      </Typography>
    </Container>
  );
}