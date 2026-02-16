import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Input, TimePicker } from 'antd';
import PropTypes from 'prop-types';
import AppContext from '../../context/AppContext';
import useApiREST from '../../Hooks/useApiREST';
import configJSON from '../config.json';
import dayjs from 'dayjs';

export const ModalModificar = ({ showModal, setShowModal, respuesta }) => {
  const { get } = useApiREST();
  const [aulas, setAulas] = useState([]);
  const { selcursosM } = useContext(AppContext);

  // Estados para almacenar los valores de los TimePicker
  const [horaInicial, setHoraInicial] = useState(dayjs('08:00', 'HH:mm'));
  const [horaFinal, setHoraFinal] = useState(dayjs('16:00', 'HH:mm'));

  useEffect(() => {
    get(`${configJSON.API_URL}:${configJSON.PORT}/listaulas`)
      .then((res) => res.json())
      .then((result) => setAulas(result));
  }, []);

  const handleAceptar = () => {
    // Actualiza los valores de los cursos con las horas seleccionadas (o por defecto)
    selcursosM.forEach((curso) => {
      curso.horaini = horaInicial.format('HH:mm');
      curso.horafin = horaFinal.format('HH:mm');
    });
    respuesta(true);
    setShowModal(false);
  };

  const handleCancelar = () => {
    respuesta(false);
    setShowModal(false);
  };

  if (!selcursosM || selcursosM.length === 0) {
    return null;
  }

  return (
    <Modal
      title="Modificar Curso"
      open={showModal}
      onCancel={handleCancelar}
      footer={null}
      destroyOnClose
    >
      <p style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
        MODIFICAR
      </p>

      {/* Selección de Aula */}
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <label style={{ marginRight: '8px' }}>Aula:</label>
        <select
          defaultValue={selcursosM[0].nombre || ''}
          onChange={(event) =>
            selcursosM.forEach((curso) => {
              curso.nombre = event.target.value;
              curso.cveaula =
                event.target.options[event.target.options.selectedIndex].getAttribute('data-key');
            })
          }
        >
          <option key="" data-key=""></option>
          {aulas.map((aula) => (
            <option key={aula.cveaula} data-key={aula.cveaula}>
              {aula.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Curso */}
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <label style={{ marginRight: '8px' }}>Curso:</label>
        <Input
          style={{ textTransform: 'uppercase' }}
          defaultValue={selcursosM[0].curso.toUpperCase()}
          onChange={(e) =>
            selcursosM.forEach((curso) => {
              curso.curso = e.target.value.toUpperCase();
            })
          }
        />
      </div>

      {/* Coord y Asist */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex' }}>
          <label style={{ marginRight: '8px' }}>Coord:</label>
          <Input
            style={{ textTransform: 'uppercase', width: '100px' }}
            defaultValue={selcursosM[0].coord}
            onChange={(e) =>
              selcursosM.forEach((curso) => {
                curso.coord = e.target.value.toUpperCase();
              })
            }
          />
        </div>
        <div style={{ display: 'flex' }}>
          <label style={{ marginRight: '8px' }}>Asist:</label>
          <Input
            type="number"
            style={{ width: '100px' }}
            defaultValue={selcursosM[0].numasist}
            onChange={(e) =>
              selcursosM.forEach((curso) => {
                curso.numasist = e.target.value;
              })
            }
          />
        </div>
      </div>

      {/* Horarios */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex' }}>
          <label style={{ marginRight: '8px' }}>Hora Inicial:</label>
          <TimePicker
            format="HH:mm"
            allowClear={false}
            value={horaInicial}
            onChange={(time) => {
              setHoraInicial(time);
              // También puedes actualizar selcursosM aquí si lo prefieres
              selcursosM.forEach((curso) => {
                curso.horaini = time.format('HH:mm');
              });
            }}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <label style={{ marginRight: '8px' }}>Hora Final:</label>
          <TimePicker
            format="HH:mm"
            allowClear={false}
            value={horaFinal}
            onChange={(time) => {
              setHoraFinal(time);
              selcursosM.forEach((curso) => {
                curso.horafin = time.format('HH:mm');
              });
            }}
          />
        </div>
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button type="primary" onClick={handleAceptar}>
          Aceptar
        </Button>
        <Button onClick={handleCancelar}>Cancelar</Button>
      </div>
    </Modal>
  );
};

ModalModificar.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  respuesta: PropTypes.func.isRequired,
};
