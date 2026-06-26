import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "antd";
import { EditOutlined, PlusOutlined, HolderOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ModalEditarAula } from "../Modals/ModalEditarAula";
import { ModalAltaAula } from "../Modals/ModalAltaAula";
import AppContext from "../../context/AppContext";
import useApiREST from "../../Hooks/useApiREST";
import PlandiarioAula from "../PlandiarioAula";
import { fechassemana } from "../FechaActual";
import configJSON from "../config.json";
import "./myCustomTable.css";

/* eslint-disable react/display-name */

const DraggableRow = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child && child.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <HolderOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "grab" }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

function Aulasconsulta() {
  const [plansemana, setPlansemana] = useState([]);
  const { get, post } = useApiREST();
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

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

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = plansemana.findIndex((r) => r.cveaula === active.id);
    const newIndex = plansemana.findIndex((r) => r.cveaula === over.id);
    const newOrder = arrayMove(plansemana, oldIndex, newIndex);

    setPlansemana(newOrder);

    const ordenActualizado = newOrder.map((aula, idx) => ({
      cveaula: aula.cveaula,
      pos: idx + 1,
    }));

    await post(
      `${configJSON.API_URL}:${configJSON.PORT}/updateaulasorden`,
      ordenActualizado,
    );
  };

  const sortColumn = token
    ? [
        {
          key: "sort",
          align: "center",
          width: 40,
          onCell: () => ({ style: { backgroundColor: "#b3d5f5" } }),
        },
      ]
    : [];

  const columns = [
    ...sortColumn,
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
        style: { backgroundColor: "#b3d5f5" },
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
          padding: 1,
          height: "100%",
          verticalAlign: "middle",
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
          padding: 1,
          height: "100%",
          verticalAlign: "middle",
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
          padding: 1,
          height: "100%",
          verticalAlign: "middle",
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
          padding: 1,
          height: "100%",
          verticalAlign: "middle",
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
          padding: 1,
          height: "100%",
          verticalAlign: "middle",
        },
      }),
      render: (text, record) => (
        <PlandiarioAula diasemana={record.cursos[0].VIERNES} />
      ),
    },
  ];

  return (
    <>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={plansemana.map((r) => r.cveaula)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={token ? { body: { row: DraggableRow } } : undefined}
            className="no-borders-no-padding my-custom-table"
            columns={columns}
            dataSource={plansemana}
            pagination={false}
            rowKey={(record) => record.cveaula}
            style={{ tableLayout: "fixed" }}
          />
        </SortableContext>
      </DndContext>

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
