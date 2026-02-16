import { useState } from "react";
import { FechaHoy } from "../components/FechaActual";
import useToken from "../components/Modals/SignIn/useToken";

const useInitialState = () => {
  const [selcursosE, setSelcursosE] = useState([]);
  const [selcursosM, setSelcursosM] = useState([]);
  const [refreshpage, setRefreshpage] = useState(true);
  const [fechabusqueda, setFechabusqueda] = useState(FechaHoy);
  const [selcursosO, setSelcursosO] = useState([]);

  const { token, setToken } = useToken();

  const seleccionaCursoEliminar = (payload) => {
    setSelcursosE(payload);
  };

  const seleccionaCursoModificar = (payload) => {
    setSelcursosM(payload);
  };

  const cleanCursoModificar = () => {
    selcursosM.length = 0;
  };

  const onRefreshPage = (payload) => {
    setRefreshpage(payload);
  };

  const buscarFecha = (fecha) => {
    setFechabusqueda(fecha);
    setRefreshpage(true);
  };

  const seleccionaCursoObservacion = (payload) => setSelcursosO(payload);

  return {
    seleccionaCursoEliminar,
    selcursosE,
    seleccionaCursoModificar,
    selcursosM,
    cleanCursoModificar,
    refreshpage,
    onRefreshPage,
    fechabusqueda,
    buscarFecha,
    setToken,
    token,
    seleccionaCursoObservacion,
    selcursosO,
  };
};

export default useInitialState;
