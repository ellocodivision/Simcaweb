"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import "./globals.css"; // ✅ Importa estilos desde la carpeta correcta

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

          // ✅ Convertir precios correctamente y eliminar caracteres extra
          const formattedData = jsonData.map((row, index) => ({
            id: index,
            ...row,
            "PRECIO DE LISTA": row["PRECIO DE LISTA"] != null ? `$${parseInt(row["PRECIO DE LISTA"].toString().replace(/[$,]/g, ""))?.toLocaleString()}` : "",
            "DESCUENTO %": row["DESCUENTO %"] != null ? `${parseFloat(row["DESCUENTO %"]) * (row["DESCUENTO %"] < 1 ? 100 : 1)}%` : "",
            "DESCUENTO $": row["DESCUENTO $"] != null ? `$${parseInt(row["DESCUENTO $"].toString().replace(/[$,]/g, ""))?.toLocaleString()}` : "",
            "PRECIO FINAL": row["PRECIO FINAL"] != null ? `$${parseInt(row["PRECIO FINAL"].toString().replace(/[$,]/g, ""))?.toLocaleString()}` : "",
            precioListaNum: row["PRECIO DE LISTA"] != null ? parseInt(row["PRECIO DE LISTA"].toString().replace(/[$,]/g, "")) : 0,
            descuentoNum: row["DESCUENTO $"] != null ? parseInt(row["DESCUENTO $"].toString().replace(/[$,]/g, "")) : 0,
            precioFinalNum: row["PRECIO FINAL"] != null ? parseInt(row["PRECIO FINAL"].toString().replace(/[$,]/g, "")) : 0,
          }));

          setData(formattedData);
        };
        reader.readAsBinaryString(blob);
      });
  }, []);

  // Definir la función para ordenar correctamente los números en la tabla
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
            valueGetter: (params) => params.row.precioListaNum, // ✅ Usa el número real para ordenar
            renderCell: (params) => `$${params.row.precioListaNum.toLocaleString()}`
          },
          { 
            field: "DESCUENTO %", 
            headerName: "Descuento %", 
            flex: 1 
          },
          { 
            field: "DESCUENTO $", 
            headerName: "Descuento $", 
            flex: 1,
            sortComparator, // ✅ Ordena correctamente por número
            valueGetter: (params) => params.row.descuentoNum, // ✅ Usa el número real para ordenar
            renderCell: (params) => `$${params.row.descuentoNum.toLocaleString()}`
          },
          { 
            field: "PRECIO FINAL", 
            headerName: "Precio Final", 
            flex: 1,
            sortComparator, // ✅ Ordena correctamente por número
            valueGetter: (params) => params.row.precioFinalNum, // ✅ Usa el número real para ordenar
            renderCell: (params) => `$${params.row.precioFinalNum.toLocaleString()}`
          },
          { field: "UBICACIÓN", headerName: "Ubicación", flex: 1 } // Última columna
        ]}
        pageSize={10}
        autoHeight
      />
    </Container>
  );
}