import React, { useEffect, useState, useContext } from 'react';
import { Table } from 'antd';
import AppContext from '../../context/AppContext';
import useApiREST from '../../Hooks/useApiREST';
import PlandiarioAula from '../PlandiarioAula';
import { fechassemana } from '../FechaActual';
import configJSON from '../config.json';
import './myCustomTable.css';

/* eslint-disable react/display-name */

function Aulasconsulta() {
  const [plansemana, setPlansemana] = useState([]);
  const { get } = useApiREST();
  const { refreshpage, onRefreshPage, fechabusqueda } = useContext(AppContext);
  const [fechas, setFechas] = useState({
    LUNES: '',
    MARTES: '',
    MIERCOLES: '',
    JUEVES: '',
    VIERNES: '',
  });

  useEffect(() => {
    if (refreshpage) {
      setFechas({
        LUNES: fechassemana(fechabusqueda, 0),
        MARTES: fechassemana(fechabusqueda, 1),
        MIERCOLES: fechassemana(fechabusqueda, 2),
        JUEVES: fechassemana(fechabusqueda, 3),
        VIERNES: fechassemana(fechabusqueda, 4),
      });

      get(`${configJSON.API_URL}:${configJSON.PORT}/listsemana?dia=${fechabusqueda}`)
        .then((response) => response.json())
        .then((result) => {
          setPlansemana(result);
        });

      onRefreshPage(false);
    }
  }, [refreshpage]);

  const columns = [
    {
      title: 'AULAS',
      dataIndex: 'nombre',
      key: 'aula',
      width: 300,
      align: 'center',
		onCell: () => ({
			style: { backgroundColor: '#b3d5f5' } // color de fondo para toda la celda
		}),
      render: (text, record) => (
		<div>
			<p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
				{record.nombre}
			</p>
			<p style={{ fontSize: '14px', margin: '4px 0', color: 'red', fontWeight: 'bold' }}>
				cap: {record.capaci}
			</p>
		</div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <div>LUNES</div>
          <div style={{fontSize: '12px', color: 'purple'}}>{fechas.LUNES}</div>
        </div>
      ),
      key: 'LUNES',
      align: 'center',
		onCell: () => ({
			style: {
			padding: 1,        // Quita el padding interno
			height: '100%',    // Permite ocupar toda la altura disponible
			verticalAlign: 'middle' // Alinea el contenido arriba (o 'middle', 'bottom')
		}
		}),
      render: (text, record) => <PlandiarioAula diasemana={record.cursos[0].LUNES} />,
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <div>MARTES</div>
          <div  style={{fontSize: '12px', color: 'purple'}}>{fechas.MARTES}</div>
        </div>
      ),
      key: 'MARTES',
      align: 'center',
		onCell: () => ({
		style: {
		padding: 1,        // Quita el padding interno
		height: '100%',    // Permite ocupar toda la altura disponible
		verticalAlign: 'middle' // Alinea el contenido arriba (o 'middle', 'bottom')
	}
	}),
      render: (text, record) => <PlandiarioAula diasemana={record.cursos[0].MARTES} />,
    },
	{
		title: (
		<div style={{ textAlign: 'center' }}>
			<div>MIERCOLES</div>
			<div  style={{fontSize: '12px', color: 'purple'}}>{fechas.MIERCOLES}</div>
		</div>
		),
		key: 'MIERCOLES',
		align: 'center',
		onCell: () => ({
			style: {
			padding: 1,        // Quita el padding interno
			height: '100%',    // Permite ocupar toda la altura disponible
			verticalAlign: 'middle' // Alinea el contenido arriba (o 'middle', 'bottom')
		}
		}),
		render: (text, record) => <PlandiarioAula diasemana={record.cursos[0].MIERCOLES} />,
	},
	{
		title: (
		<div style={{ textAlign: 'center' }}>
			<div>JUEVES</div>
			<div style={{fontSize: '12px', color: 'purple'}}>{fechas.JUEVES}</div>
		</div>
		),
		key: 'JUEVES',
		align: 'center',
		onCell: () => ({
			style: {
			padding: 1,        // Quita el padding interno
			height: '100%',    // Permite ocupar toda la altura disponible
			verticalAlign: 'middle' // Alinea el contenido arriba (o 'middle', 'bottom')
		}
		}),
		render: (text, record) => <PlandiarioAula diasemana={record.cursos[0].JUEVES} />,
	},
	{
		title: (
		<div style={{ textAlign: 'center' }}>
			<div>VIERNES</div>
			<div  style={{fontSize: '12px', color: 'purple'}}>{fechas.VIERNES}</div>
		</div>
		),
		key: 'VIERNES',
		align: 'center',
		onCell: () => ({
			style: {
			padding: 1,        // Quita el padding interno
			height: '100%',    // Permite ocupar toda la altura disponible
			verticalAlign: 'middle' // Alinea el contenido arriba (o 'middle', 'bottom')
		}
		}),
		render: (text, record) => <PlandiarioAula diasemana={record.cursos[0].VIERNES} />,
	},
  ];

  return (
    
      <Table
		className="no-borders-no-padding my-custom-table"
        columns={columns}
        dataSource={plansemana}
        pagination={false}
        rowKey={(record) => record.cveaula}
		style={{ tableLayout: 'fixed' }}
      />
    
  );
}

export default Aulasconsulta;




