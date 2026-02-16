// /src/components/Busqueda/index.jsx
import React, { useState, useContext, useEffect } from "react";
import { parseISO, format, isValid, addDays, startOfWeek } from "date-fns";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  LoginOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { addingDate, extractFecha, FechaHoy } from "../FechaActual";

import { ModalAlta } from "../Modals/ModalAlta";
import { ModalBaja } from "../Modals/ModalBaja";
import { ModalModificar } from "../Modals/ModalModificar.jsx";
import { ModalSignIn } from "../Modals/ModalSignIn.jsx";
import { ModalObservacion } from "../Modals/ModalObservacion.jsx";

import useToken from "../Modals/SignIn/useToken";
import AppContext from "../../context/AppContext";
import useApiREST from "../../Hooks/useApiREST";

import { SeccionBusqueda } from "./busqueda-style";

import configJSON from "../config.json";
//import { API_URL, PORT } from '@env';

const Busqueda = () => {
  const { deleteToken } = useToken();

  const {
    selcursosE,
    selcursosM,
    selcursosO,
    onRefreshPage,
    buscarFecha,
    fechabusqueda,
    token,
  } = useContext(AppContext);

  const [fechaseleccionada, setFechaseleccionada] = useState(fechabusqueda);
  const [showModalAlta, setShowModalAlta] = useState(false);
  const [showModalBaja, setShowModalBaja] = useState(false);
  const [showModalModificarFecha, setShowModalModificarFecha] = useState(false);
  const [showModalSignIn, setShowModalSignIn] = useState(false);
  const [showModalObservacion, setShowModalObservacion] = useState(false);

  const [primerdiasemana, setPrimerdiasemana] = useState();
  const [ultimodiasemana, setUltimodiasemana] = useState();

  const { post } = useApiREST();

  useEffect(() => {
    buscarFecha(fechaseleccionada);

    setPrimerdiasemana(() => {
      const fecha = parseISO(fechaseleccionada);
      if (!isValid(fecha))
        throw new Error(`Fecha inválida: ${fechaseleccionada}`);

      // Obtener el lunes de la semana de la fecha seleccionada
      const primerdiasemana = startOfWeek(fecha, { weekStartsOn: 1 });
      return format(primerdiasemana, "yyyy-MM-dd");
    });

    setUltimodiasemana(() => {
      const fecha = parseISO(fechaseleccionada);
      if (!isValid(fecha))
        throw new Error(`Fecha inválida: ${fechaseleccionada}`);

      // Obtener el viernes de la semana
      const ultimodiasemana = addDays(
        startOfWeek(fecha, { weekStartsOn: 1 }),
        4,
      );
      return format(ultimodiasemana, "yyyy-MM-dd");
    });
  }, [fechaseleccionada]);

  /*	const handleFechaSeleccion = (event) => {
		setFechaseleccionada(event.target.value);
	};*/

  const handleGuardarCurso = (event) => {
    new Promise((resolve) => {
      resolve(
        post(`${configJSON.API_URL}:${configJSON.PORT}/insertcurso`, event),
      );
    }).then((response) => {
      response.ok && onRefreshPage(true);
    });
  };

  const handleModificarCurso = (event) => {
    event &&
      new Promise((resolve) => {
        resolve(
          post(
            `${configJSON.API_URL}:${configJSON.PORT}/updatecurso`,
            selcursosM,
          ),
        );
      }).then((response) => {
        selcursosM.length = 0;
        response.ok && onRefreshPage(true);
      });
  };

  const handleEliminaCurso = async (event) => {
    event &&
      new Promise((resolve) => {
        resolve(
          post(
            `${configJSON.API_URL}:${configJSON.PORT}/deletecurso`,
            selcursosE,
          ),
        );
      }).then((response) => {
        selcursosE.length = 0;
        response.ok && onRefreshPage(true);
      });
  };

  return (
    <SeccionBusqueda>
      <ModalAlta
        showModal={showModalAlta}
        setShowModal={setShowModalAlta}
        setAulaInfo={handleGuardarCurso}
        primerdiasemana={primerdiasemana}
        ultimodiasemana={ultimodiasemana}
      ></ModalAlta>
      <ModalBaja
        showModal={showModalBaja}
        setShowModal={setShowModalBaja}
        respuesta={handleEliminaCurso}
      ></ModalBaja>
      <ModalModificar
        showModal={showModalModificarFecha}
        setShowModal={setShowModalModificarFecha}
        respuesta={handleModificarCurso}
      ></ModalModificar>
      <ModalObservacion
        showModal={showModalObservacion}
        setShowModal={setShowModalObservacion}
        onSuccess={() => onRefreshPage(true)}
      />
      <ModalSignIn
        showModal={showModalSignIn}
        setShowModal={setShowModalSignIn}
      ></ModalSignIn>

      <DatePicker
        //defaultValue={dayjs().format("YYYY-MM-DD")}
        defaultValue={dayjs()} // objeto dayjs con fecha actual
        format="YYYY-MM-DD" // formato de visualización
        style={{
          width: "380px",
          border: "3px solid #000", // Borde negro de 3px
          borderRadius: "6px", // Opcional, si quieres esquinas redondeadas
        }}
        size="large"
        allowClear={false}
        onChange={(date, dateString) => {
          setFechaseleccionada(dateString);
          buscarFecha(dateString);
        }}
      />
      <Button
        type="primary"
        style={{
          marginRight: "8px",
          marginLeft: "8px",
          //backgroundColor: '#ff0000', // Rojo de fondo
          borderColor: "black", // Borde rojo
          //color: '#fff',               // Texto en blanco para contraste
          fontWeight: "bold",
        }}
        size="large"
        onClick={() => {
          setFechaseleccionada(FechaHoy);
          buscarFecha(FechaHoy);
        }}
      >
        <CalendarOutlined style={{ marginRight: "8px" }} />
        {`Semana actual`}
      </Button>
      <Button
        style={{
          marginRight: "8px",
          color: "black",
          border: "3px solid black",
          fontWeight: "bold",
        }}
        size="large"
        onClick={() => {
          const nuevaFecha = addingDate(fechaseleccionada, -6);
          const fechaExtraida = extractFecha(nuevaFecha);

          const nuevaFechaStr = `${fechaExtraida.anio}-${fechaExtraida.mes}-${fechaExtraida.dia}`;
          setFechaseleccionada(nuevaFechaStr);
          buscarFecha(nuevaFechaStr);
        }}
      >
        <ArrowLeftOutlined style={{ marginRight: "8px" }} />
        {`Semana Anterior`}
      </Button>
      <Button
        style={{
          marginRight: "8px",
          color: "black",
          border: "3px solid black",
          fontWeight: "bold",
        }}
        size="large"
        onClick={() => {
          const nuevaFecha = addingDate(fechaseleccionada, 8);
          const fechaExtraida = extractFecha(nuevaFecha);

          const nuevaFechaStr = `${fechaExtraida.anio}-${fechaExtraida.mes}-${fechaExtraida.dia}`;
          setFechaseleccionada(nuevaFechaStr);
          buscarFecha(nuevaFechaStr);
        }}
      >
        {`Semana siguiente`}
        <ArrowRightOutlined style={{ marginRight: "8px" }} />
      </Button>

      <div
        style={{
          display: "flex",
          visibility: token ? "visible" : "hidden",
          width: "100%",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <Button
          size="large"
          style={{
            color: "black",
            border: "3px solid black",
            fontWeight: "bold",
            width: "150px",
          }}
          onClick={() => setShowModalAlta(true)}
        >
          <PlusOutlined style={{ marginRight: "8px" }} />
          Agregar
        </Button>
        <Button
          type="primary"
          size="large"
          style={{
            color: "black",
            border: "3px solid black",
            fontWeight: "bold",
            width: "150px",
          }}
          disabled={Object.keys(selcursosE).length === 0}
          onClick={() => setShowModalBaja(true)}
        >
          <DeleteOutlined style={{ marginRight: "8px" }} />
          Eliminar
        </Button>
        <Button
          type="primary"
          size="large"
          style={{
            color: "black",
            border: "3px solid black",
            fontWeight: "bold",
            width: "150px",
          }}
          disabled={Object.keys(selcursosM).length === 0}
          onClick={() => setShowModalModificarFecha(true)}
        >
          <EditOutlined style={{ marginRight: "8px" }} />
          Modificar
        </Button>
        <Button
          type="primary"
          size="large"
          style={{
            color: "black",
            border: "3px solid black",
            fontWeight: "bold",
            width: "150px",
          }}
          disabled={Object.keys(selcursosO).length === 0}
          onClick={() => setShowModalObservacion(true)}
        >
          Observación
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginLeft: "8px",
        }}
      >
        <Button
          type="primary"
          style={{
            display: token ? "none" : "inline",
            backgroundColor: "#28a745",
            borderColor: "#28a745",
            color: "#fff",
            border: "3px solid black",
            fontWeight: "bold",
          }}
          size="large"
          onClick={() => setShowModalSignIn(true)}
        >
          <LoginOutlined style={{ marginRight: "8px" }} />
          {`Login`}
        </Button>
        <Button
          type="primary"
          style={{
            display: token ? "inline" : "none",
            backgroundColor: "#dc3545", // Rojo tipo "Bootstrap danger"
            borderColor: "#dc3545",
            color: "#fff",
            border: "3px solid black",
            fontWeight: "bold",
          }}
          size="large"
          onClick={() => {
            window.location.reload();
            deleteToken();
          }}
        >
          <LogoutOutlined style={{ marginRight: "8px" }} />
          {`Logout`}
        </Button>
      </div>
    </SeccionBusqueda>
  );
};

export default Busqueda;
