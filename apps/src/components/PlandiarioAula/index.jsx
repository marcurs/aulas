// src/components/PlandiarioAula/index.jsx
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Checkbox, Tag, Popover } from "antd";
import AppContext from "../../context/AppContext";
import { addLeadingZeros, extractFecha } from "../FechaActual";

function PlandiarioAula({ diasemana }) {
  const {
    seleccionaCursoEliminar,
    selcursosE,
    seleccionaCursoModificar,
    selcursosM,
    token,
    refreshpage,
    seleccionaCursoObservacion,
    selcursosO,
  } = useContext(AppContext);

  // Estado local para los checkboxes, un objeto por cada elemento de diasemana
  const [checkboxStates, setCheckboxStates] = useState([]);

  // Inicializa el estado de los checkboxes cuando cambia diasemana
  useEffect(() => {
    if (diasemana) {
      setCheckboxStates(
        diasemana.map(() => ({
          modificar: false,
          eliminar: false,
          observacion: false,
        })),
      );
    }
  }, [diasemana]);

  // Cuando refreshpage es true, reinicia todos los checkboxes a false
  useEffect(() => {
    if (refreshpage && diasemana) {
      setCheckboxStates(
        diasemana.map(() => ({
          modificar: false,
          eliminar: false,
          observacion: false,
        })),
      );
    }
  }, [refreshpage, diasemana]);

  // Función auxiliar para formatear la fecha usando extractFecha
  const formatDate = (fecha) => {
    const { anio, mes, dia } = extractFecha(fecha);
    return `${anio}-${mes}-${dia}`;
  };

  // Función auxiliar para formatear la hora
  const formatTime = (fecha) =>
    fecha.toLocaleTimeString("es-MX", {
      timeZone: "America/Mexico_City",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  // Construye contenido del Popover solo si hay datos
  const buildObsPopover = (c) => {
    const obs = (c?.observador_nombre || "").trim();
    const com = (c?.observacion_comentarios || "").trim();

    if (!obs && !com) return null;

    return (
      <div style={{ maxWidth: 320 }}>
        {obs && (
          <div style={{ marginBottom: com ? 8 : 0 }}>
            <b>Observador:</b> {obs}
          </div>
        )}
        {com && (
          <div style={{ whiteSpace: "pre-wrap" }}>
            <b>Comentarios:</b>
            <div>{com}</div>
          </div>
        )}
      </div>
    );
  };

  if (!diasemana || diasemana.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#f6f2f0",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "120px",
        }}
      />
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#edf2fb",
        width: "100%",
        minHeight: "50px",
      }}
    >
      {diasemana.map((cursodia, idx) => {
        // Prepara datos de fechas y horas
        const fecIni = new Date(cursodia.fecini);
        const fecFin = new Date(cursodia.fecfin);

        const inicioStr = `Inicio: ${addLeadingZeros(
          fecIni.getHours(),
        )}:${addLeadingZeros(fecIni.getMinutes())}`;

        const finStr = `Fin: ${addLeadingZeros(
          fecFin.getHours(),
        )}:${addLeadingZeros(fecFin.getMinutes())}`;

        // Selección modificar
        const handleModificar = (checked) => {
          if (checked) {
            seleccionaCursoModificar([
              ...selcursosM,
              {
                curso: cursodia.curso,
                cveaula: cursodia.cveaula,
                nombre: cursodia.nombre,
                cvecurso: cursodia.cvecurso,
                fecini: formatDate(cursodia.fecini),
                fecfin: formatDate(cursodia.fecfin),
                horaini: formatTime(fecIni),
                horafin: formatTime(fecFin),
                coord: cursodia.coord,
                numasist: cursodia.numasist,
              },
            ]);
          } else {
            seleccionaCursoModificar(
              selcursosM.filter(
                (value) => value.cvecurso !== cursodia.cvecurso,
              ),
            );
          }
        };

        // Selección eliminar
        const handleEliminar = (checked) => {
          if (checked) {
            seleccionaCursoEliminar(selcursosE.concat(cursodia.cvecurso));
          } else {
            seleccionaCursoEliminar(
              selcursosE.filter((value) => value !== cursodia.cvecurso),
            );
          }
        };

        // Selección observación (para batch)
        const handleObservacion = (checked) => {
          if (checked) {
            const item = {
              cvecurso: cursodia.cvecurso,
              observacion_estado: cursodia.observacion_estado ?? 0,
              observador_nombre: cursodia.observador_nombre ?? "",
              observacion_comentarios: cursodia.observacion_comentarios ?? "",
            };

            // reemplaza si ya existía
            const filtrados = selcursosO.filter(
              (v) => v.cvecurso !== cursodia.cvecurso,
            );
            seleccionaCursoObservacion([...filtrados, item]);
          } else {
            seleccionaCursoObservacion(
              selcursosO.filter((v) => v.cvecurso !== cursodia.cvecurso),
            );
          }
        };

        // Tag de estado + Popover
        const estado = Number(cursodia.observacion_estado ?? 0);

        const tag =
          estado === 0 ? (
            <Tag></Tag>
          ) : estado === 1 ? (
            <Tag color="blue">Observación Programada</Tag>
          ) : estado === 2 ? (
            <Tag color="green">Observado</Tag>
          ) : (
            <Tag color="red">No observado</Tag>
          );

        const popContent = buildObsPopover(cursodia);

        return (
          <div
            key={idx}
            style={{
              backgroundColor: "#edf2fb",
            }}
          >
            {/* Fila con checkboxes */}
            <Row
              style={{
                backgroundColor: "lightblue",
                visibility: token ? "visible" : "hidden",
              }}
            >
              <Col span={8} style={{ textAlign: "left", paddingLeft: "8px" }}>
                <label style={{ fontWeight: "bold", cursor: "pointer" }}>
                  Modificar
                  <Checkbox
                    checked={checkboxStates[idx]?.modificar || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCheckboxStates((prev) => {
                        const newStates = [...prev];
                        newStates[idx] = {
                          ...newStates[idx],
                          modificar: checked,
                        };
                        return newStates;
                      });
                      handleModificar(checked);
                    }}
                    style={{ marginLeft: "5px" }}
                  />
                </label>
              </Col>

              <Col span={8} style={{ textAlign: "center" }}>
                <label style={{ fontWeight: "bold", cursor: "pointer" }}>
                  Observ.
                  <Checkbox
                    checked={checkboxStates[idx]?.observacion || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCheckboxStates((prev) => {
                        const newStates = [...prev];
                        newStates[idx] = {
                          ...newStates[idx],
                          observacion: checked,
                        };
                        return newStates;
                      });
                      handleObservacion(checked);
                    }}
                    style={{ marginLeft: "5px" }}
                  />
                </label>
              </Col>

              <Col span={8} style={{ textAlign: "right", paddingRight: "8px" }}>
                <label style={{ fontWeight: "bold", cursor: "pointer" }}>
                  Eliminar
                  <Checkbox
                    checked={checkboxStates[idx]?.eliminar || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCheckboxStates((prev) => {
                        const newStates = [...prev];
                        newStates[idx] = {
                          ...newStates[idx],
                          eliminar: checked,
                        };
                        return newStates;
                      });
                      handleEliminar(checked);
                    }}
                    style={{ marginLeft: "5px" }}
                  />
                </label>
              </Col>
            </Row>

            {/* Información del curso */}
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>
              {cursodia.curso}
            </div>
            <div style={{ color: "purple", fontSize: "12px" }}>
              {cursodia.coord}
            </div>
            <div style={{ color: "purple", fontSize: "12px" }}>
              asistentes: ({cursodia.numasist})
            </div>

            {/* Estado de observación (Tag + Popover hover) */}
            <div style={{ marginTop: 4 }}>
              {popContent ? (
                <Popover
                  title="Detalle de observación"
                  content={popContent}
                  trigger="hover"
                  placement="top"
                >
                  <div style={{ display: "inline-block", cursor: "pointer" }}>
                    {tag}
                  </div>
                </Popover>
              ) : (
                tag
              )}
              {/* Nombre del observador debajo del Tag */}
              <div
                style={{
                  marginTop: 2,
                  fontSize: "12px",
                  color: "purple",
                  fontWeight: "bold",
                  lineHeight: "14px",
                  minHeight: "14px", // asegura altura constante
                  visibility:
                    Number(cursodia.observacion_estado ?? 0) !== 0 &&
                    (cursodia.observador_nombre || "").trim().length > 0
                      ? "visible"
                      : "hidden",
                }}
              >
                {(cursodia.observador_nombre || "—").trim()}
              </div>
            </div>

            {/* Horario */}
            <Row
              style={{
                backgroundColor: "lightgrey",
                marginTop: "8px",
                padding: "4px 0",
              }}
            >
              <Col span={12} style={{ textAlign: "left", paddingLeft: "8px" }}>
                <div
                  style={{
                    color: "blue",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {inicioStr}
                </div>
              </Col>
              <Col
                span={12}
                style={{ textAlign: "right", paddingRight: "8px" }}
              >
                <div
                  style={{
                    color: "blue",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {finStr}
                </div>
              </Col>
            </Row>
          </div>
        );
      })}
    </div>
  );
}

PlandiarioAula.propTypes = {
  diasemana: PropTypes.array,
};

export default PlandiarioAula;
