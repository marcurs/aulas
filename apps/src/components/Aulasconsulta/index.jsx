import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ModalEditarAula } from "../Modals/ModalEditarAula";
import { ModalAltaAula } from "../Modals/ModalAltaAula";
import AppContext from "../../context/AppContext";
import useApiREST from "../../Hooks/useApiREST";
import PlandiarioAula from "../PlandiarioAula";
import { fechassemana } from "../FechaActual";
import configJSON from "../config.json";
import "./myCustomTable.css";

/* eslint-disable react/display-name */

function Aulasconsulta() {
  const [plansemana, setPlansemana] = useState([]);
  const { get } = useApiREST();
  const { refreshpage, onRefreshPage, fechabusqueda, token } =
    useContext(AppContext);

  const [fechas, setFechas] = useState({
    LUNES: "",
    MARTES: "",
    MIERCOLES: "",
    JUEVES: "",
    VIERNES: "",
  });

  const [showModalEditarAula, setShowModalEditarAula] = useState(false);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [showModalAltaAula, setShowModalAltaAula] = useState(false);

  useEffect(() => {
    if (refreshpage) {
      setFechas({
        LUNES: fechassemana(fechabusqueda, 0),
        MARTES: fechassemana(fechabusqueda, 1),
        MIERCOLES: fechassemana(fechabusqueda, 2),
        JUEVES: fechassemana(fechabusqueda, 3),
        VIERNES: fechassemana(fechabusqueda, 4),
      });

      get(
        `${configJSON.API_URL}:${configJSON.PORT}/listsemana?dia=${fechabusqueda}`,
      )
        .then((response) => response.json())
        .then((result) => {
          setPlansemana(result);
        });

      onRefreshPage(false);
    }
  }, [refreshpage]);

  const columns = [
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div>AULAS</div>
          {token ? (
            <Button
              size="small"
              icon={<PlusOutlined />}
              style={{ marginTop: 4 }}
              onClick={() => setShowModalAltaAula(true)}
            >
              Nueva aula
            </Button>
          ) : null}
        </div>
      ),
      dataIndex: "nombre",
      key: "aula",
      width: 300,
      align: "center",
      onCell: () => ({
        style: { backgroundColor: "#b3d5f5" }, // color de fondo para toda la celda
      }),
      render: (text, record) => (
        <div>
          <p style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
            {record.nombre}
          </p>

          <p
            style={{
              fontSize: "14px",
              margin: "4px 0",
              color: "red",
              fontWeight: "bold",
            }}
          >
            cap: {record.capaci}
          </p>

          {token ? (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setAulaSeleccionada({
                  cveaula: record.cveaula,
                  nombre: record.nombre,
                  capaci: record.capaci,
                });
                setShowModalEditarAula(true);
              }}
            >
              Editar aula
            </Button>
          ) : null}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div>LUNES</div>
          <div style={{ fontSize: "12px", color: "purple" }}>
            {fechas.LUNES}
          </div>
        </div>
      ),
      key: "LUNES",
      align: "center",
      onCell: () => ({
        style: {
          padding: 1, // Quita el padding interno
          height: "100%", // Permite ocupar toda la altura disponible
          verticalAlign: "middle", // Alinea el contenido arriba (o 'middle', 'bottom')
        },
      }),
      render: (text, record) => (
        <PlandiarioAula diasemana={record.cursos[0].LUNES} />
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div>MARTES</div>
          <div style={{ fontSize: "12px", color: "purple" }}>
            {fechas.MARTES}
          </div>
        </div>
      ),
      key: "MARTES",
      align: "center",
      onCell: () => ({
        style: {
          padding: 1, // Quita el padding interno
          height: "100%", // Permite ocupar toda la altura disponible
          verticalAlign: "middle", // Alinea el contenido arriba (o 'middle', 'bottom')
        },
      }),
      render: (text, record) => (
        <PlandiarioAula diasemana={record.cursos[0].MARTES} />
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div>MIERCOLES</div>
          <div style={{ fontSize: "12px", color: "purple" }}>
            {fechas.MIERCOLES}
          </div>
        </div>
      ),
      key: "MIERCOLES",
      align: "center",
      onCell: () => ({
        style: {
          padding: 1, // Quita el padding interno
          height: "100%", // Permite ocupar toda la altura disponible
          verticalAlign: "middle", // Alinea el contenido arriba (o 'middle', 'bottom')
        },
      }),
      render: (text, record) => (
        <PlandiarioAula diasemana={record.cursos[0].MIERCOLES} />
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div>JUEVES</div>
          <div style={{ fontSize: "12px", color: "purple" }}>
            {fechas.JUEVES}
          </div>
        </div>
      ),
      key: "JUEVES",
      align: "center",
      onCell: () => ({
        style: {
          padding: 1, // Quita el padding interno
          height: "100%", // Permite ocupar toda la altura disponible
          verticalAlign: "middle", // Alinea el contenido arriba (o 'middle', 'bottom')
        },
      }),
      render: (text, record) => (
        <PlandiarioAula diasemana={record.cursos[0].JUEVES} />
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div>VIERNES</div>
          <div style={{ fontSize: "12px", color: "purple" }}>
            {fechas.VIERNES}
          </div>
        </div>
      ),
      key: "VIERNES",
      align: "center",
      onCell: () => ({
        style: {
          padding: 1, // Quita el padding interno
          height: "100%", // Permite ocupar toda la altura disponible
          verticalAlign: "middle", // Alinea el contenido arriba (o 'middle', 'bottom')
        },
      }),
      render: (text, record) => (
        <PlandiarioAula diasemana={record.cursos[0].VIERNES} />
      ),
    },
  ];

  return (
    <>
      <Table
        className="no-borders-no-padding my-custom-table"
        columns={columns}
        dataSource={plansemana}
        pagination={false}
        rowKey={(record) => record.cveaula}
        style={{ tableLayout: "fixed" }}
      />

      <ModalEditarAula
        showModal={showModalEditarAula}
        setShowModal={setShowModalEditarAula}
        aula={aulaSeleccionada}
        onSuccess={() => onRefreshPage(true)}
      />

      <ModalAltaAula
        showModal={showModalAltaAula}
        setShowModal={setShowModalAltaAula}
        onSuccess={() => onRefreshPage(true)}
      />
    </>
  );
}

export default Aulasconsulta;
