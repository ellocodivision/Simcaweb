"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import "./globals.css";

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

          const formattedData = jsonData.map((row, index) => ({
            id: index,
            desarrollo: row["DESARROLLO"] || "",
            unidad: row["UNIDAD"] || "",
            recamaras: row["RECAMARAS"] ? row["RECAMARAS"].toString() : "",
            ubicacion: row["UBICACIÓN"] || "",
            precioLista: Math.round(Number(row["PRECIO DE LISTA"]?.toString().replace(/[$,]/g, "")) || 0),
            descuentoPorcentaje: row["DESCUENTO %"]
              ? Math.round(Number(row["DESCUENTO %"]) * (row["DESCUENTO %"] < 1 ? 100 : 1))
              : 0,
            descuentoDinero: Math.round(Number(row["DESCUENTO $"]?.toString().replace(/[$,]/g, "")) || 0),
            precioFinal: Math.round(Number(row["PRECIO FINAL"]?.toString().replace(/[$,]/g, "")) || 0),
          }));

          setData(formattedData);
          setFilteredData(formattedData);
        };
        reader.readAsBinaryString(blob);
      })
      .catch((error) => console.error("Error cargando el archivo:", error));
  }, []);

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

  const resetFilters = () => {
    setUbicacionFilter("Todos");
    setDesarrolloFilter("Todos");
    setRecamarasFilter("Todos");
    setPrecioFilter("Todos");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🏢 DESARROLLOS SIMCA - Inventario Online
      </Typography>

      <DataGrid rows={filteredData} columns={[{ field: "desarrollo", headerName: "Desarrollo", flex: 1 },{ field: "unidad", headerName: "Unidad", flex: 1 },{ field: "recamaras", headerName: "Recámaras", flex: 1 },{ field: "precioLista", headerName: "Precio de Lista", flex: 1, renderCell: (params) => `$${params.value.toLocaleString()}` },{ field: "descuentoPorcentaje", headerName: "Descuento %", flex: 1, renderCell: (params) => `${params.value}%` },{ field: "descuentoDinero", headerName: "Descuento $", flex: 1, renderCell: (params) => `$${params.value.toLocaleString()}` },{ field: "precioFinal", headerName: "Precio Final", flex: 1, renderCell: (params) => `$${params.value.toLocaleString()}` },{ field: "ubicacion", headerName: "Ubicación", flex: 1 }]} pageSize={10} autoHeight />

      <Typography variant="h5" style={{ marginTop: "20px" }}>📌 PLAYA DEL CARMEN</Typography>
      <ul>
        <li><a href="https://drive.google.com/drive/folders/1wLmmckCcHJZpo4epx1wOL9y29ZVr1CRW?usp=drive_link">Ceiba - Drive</a></li>
        <li><a href="https://drive.google.com/drive/folders/1iZ6IGvc9g-N9bdQ62N7_XKWxtSWtEmHW?usp=drive_link">Cruz con Mar - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1iYveTUNluxpXMXIzNkrTM1DotXeb_y2D?usp=drive_link">Ipana - Drive</a></li>
      </ul>
        <li><a href="(https://drive.google.com/drive/folders/12yciY02hANBw9m6bk80IeA9pLeAyNZtt?usp=drive_link">Maresol - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1iP7Qeq2sYPf1sTOs85OHs3wNpGqFaWtk?usp=drive_link">Marila - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1aBGyq-HYte_2NeShwYZNvBwOaNgkhJGQ?usp=drive_link">Saint Marine - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1iLgemRqqQEcayfTbZjfWr4jkumvj_797?usp=drive_link">Serenada - Drive</a></li>
      </ul>
        <li><a href="    <li><a href="https://drive.google.com/drive/folders/1iLgemRqqQEcayfTbZjfWr4jkumvj_797?usp=drive_link">Serenada - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1iLgemRqqQEcayfTbZjfWr4jkumvj_797?usp=drive_link">Serenada - Drive</a></li>
      </ul>">Singular Joy - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1-1vnJQG2totiL_odvm_CJoNCp6GvVZF6?usp=drive_link">Solar estudios - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1CkeGNWApzo3Dwsh5JsBgXVrYtjfo6EfL?usp=drive_link">Solar midtown - Drive</a></li>
      </ul>
      <Typography variant="h5">📌 TULUM</Typography>
      <ul>
        <li><a href="https://drive.google.com/drive/folders/1Ka-9_TXx8hbKDNrtYM1A5iYCqvYyeNbI?usp=drive_link">Costa Caribe - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1Ka-9_TXx8hbKDNrtYM1A5iYCqvYyeNbI?usp=drive_link">Gran Tulum - Drive</a></li>
      </ul>
        <li><a href="https://drive.google.com/drive/folders/1CX-qEyXVi_RqmRoeFl-Tq0sVNfKEUtrw?usp=drive_link">Natal - Drive</a></li>
      </ul>
      <Typography variant="h5">📞 Contacto</Typography>
      <a href="https://drive.google.com/file/d/1xzsKBinrBmRFkbZf0_L_rFIPr4FfRgx9/view?usp=drive_link">CONTACTO</a>
    </Container>
  );
}









Ceiba - Drive (https://drive.google.com/drive/folders/1wLmmckCcHJZpo4epx1wOL9y29ZVr1CRW?usp=drive_link)
Cruz con Mar - Drive (https://drive.google.com/drive/folders/1iZ6IGvc9g-N9bdQ62N7_XKWxtSWtEmHW?usp=drive_link)
pana - Drive (https://drive.google.com/drive/folders/1iYveTUNluxpXMXIzNkrTM1DotXeb_y2D?usp=drive_link)
Maresol - Drive (https://drive.google.com/drive/folders/12yciY02hANBw9m6bk80IeA9pLeAyNZtt?usp=drive_link)
Marila - Drive (https://drive.google.com/drive/folders/1iP7Qeq2sYPf1sTOs85OHs3wNpGqFaWtk?usp=drive_link)
Saint Marine - Drive (https://drive.google.com/drive/folders/1aBGyq-HYte_2NeShwYZNvBwOaNgkhJGQ?usp=drive_link)
Serenada - Drive (https://drive.google.com/drive/folders/1iLgemRqqQEcayfTbZjfWr4jkumvj_797?usp=drive_link)
Singular Joy - Drive (https://drive.google.com/drive/folders/1gNjYsbSaZbDwH_51Xp7d6Wwsn6rIhRDy?usp=drive_link)
Solar estudios - Drive (https://drive.google.com/drive/folders/1-1vnJQG2totiL_odvm_CJoNCp6GvVZF6?usp=drive_link)
Solar midtown - Drive (https://drive.google.com/drive/folders/1CkeGNWApzo3Dwsh5JsBgXVrYtjfo6EfL?usp=drive_link)

📌 TULUM 

Costa Caribe - Drive (https://drive.google.com/drive/folders/1Ka-9_TXx8hbKDNrtYM1A5iYCqvYyeNbI?usp=drive_link)
Gran Tulum - Drive (https://drive.google.com/drive/folders/1HMDG7UBljBe9GwYwtvW8ZjmJpwylTca5?usp=drive_link)
Natal - Drive (https://drive.google.com/drive/folders/1CX-qEyXVi_RqmRoeFl-Tq0sVNfKEUtrw?usp=drive_link)

📞 Contacto
CONTACTO (https://drive.google.com/file/d/1xzsKBinrBmRFkbZf0_L_rFIPr4FfRgx9/view?usp=drive_link)