/* import React, { useRef, useEffect, useState } from 'react';
import useApiREST from '../../Hooks/useApiREST';
import PropTypes from 'prop-types';

import configJSON from '../config.json';
//import { API_URL, PORT } from '@env';

import {
	Background,
	ModalWrapper,
	ModalContent,
	CloseModalButton,
} from './modal';

export const ModalAlta = ({ showModal, setShowModal, setAulaInfo, primerdiasemana, ultimodiasemana }) => {
	const [disableButton, setDisableButton] = useState(true);
	const [aulas, setAulas] = useState([]);
	const [nuevoRegistro, setNuevoRegistro] = useState({});
	const { get } = useApiREST();
	const modalRef = useRef();
	
	const closeModal = (e) => {
		if (modalRef.current === e.target) {
			setShowModal(false);
		}
	};

	/* const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && showModal) {
				setShowModal(false);
			}
		},
		[setShowModal, showModal]
	);

	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]); 

	useEffect(() => {
		setNuevoRegistro({
			nombre: '',
			cveaula: '',
			curso: '',
			fecini: primerdiasemana,
			fecfin: ultimodiasemana,
			horaini: '08:00',
			horafin: '16:00',
			coord: '',
			numasist: '',
		});
	}, [showModal]);

	useEffect(() => {
		if (
			nuevoRegistro.nombre === '' ||
			nuevoRegistro.cveaula === '' ||
			nuevoRegistro.curso === '' ||
			/* nuevoRegistro.fecini === '' ||
			nuevoRegistro.fecfin === '' || 
			nuevoRegistro.coord === '' ||
			nuevoRegistro.numasist === ''
		) {
			setDisableButton(true);
			return;
		}

		setDisableButton(false);
	}, [nuevoRegistro]);

	useEffect(() => {
		new Promise((resolve) => {
			resolve(get(`${configJSON.API_URL}:${configJSON.PORT}/listaulas`));
		}).then((response) =>
			response.json().then((result) => {
				setAulas(result);
			})
		);
	}, []);

	const handleOnSubmit = (event) => {
		event.preventDefault();

		setAulaInfo(nuevoRegistro);
		setShowModal(false);
	};

	return (
		<>
			{showModal ? (
				<Background onClick={closeModal} ref={modalRef}>
					<ModalWrapper showModal={showModal}>
						<div
							style={{
								width: '100%',
								backgroundColor: '#ffff3f',
								color: 'black',
								fontSize: '28px',
								textAlign: 'center',
								height: '50px',
								paddingTop: '10px',
							}}>
							Alta de curso
						</div>
						<ModalContent>
							<form onSubmit={handleOnSubmit}>
								<section style={{ marginBottom: '20px' }}>
									<label>Aula:</label>
									<select
										onChange={(event) =>
											setNuevoRegistro({
												...nuevoRegistro,
												nombre: event.target.value,
												cveaula:
													event.target.options[
														event.target.options.selectedIndex
													].getAttribute('data-key'),
											})
										}>
										<option key='' data-key=''></option>
										{aulas.map((aula) => {
											return (
												<option key={aula.cveaula} data-key={aula.cveaula}>
													{aula.nombre}
												</option>
											);
										})}
									</select>
								</section>
								<section
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginBottom: '20px',
									}}>
									<div
										style={{
											display: 'flex',
										}}>
										<label>Fecha Inicial:</label>
										<input
											id='fecini'
											type='date'
											onChange={(event) => {
												setNuevoRegistro({
													...nuevoRegistro,
													fecini: event.target.value,
												});
											}}
											defaultValue={primerdiasemana}
										/>
									</div>
									<div
										style={{
											display: 'flex',
										}}>
										<label>Fecha Final:</label>
										<input
											id='fecfin'
											type='date'
											onChange={(event) => {
												setNuevoRegistro({
													...nuevoRegistro,
													fecfin: event.target.value,
												});
											}}
											defaultValue={ultimodiasemana}
										/>
									</div>
								</section>
								<section
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginBottom: '20px',
									}}>
									<div
										style={{
											display: 'flex',
										}}>
										<label>Hora Inicial:</label>
										<input
											type='time'
											defaultValue='08:00'
											onChange={(event) =>
												setNuevoRegistro({
													...nuevoRegistro,
													horaini: event.target.value,
												})
											}
										/>
									</div>
									<div
										style={{
											display: 'flex',
										}}>
										<label>Hora Final:</label>
										<input
											type='time'
											defaultValue='16:00'
											onChange={(event) =>
												setNuevoRegistro({
													...nuevoRegistro,
													horafin: event.target.value,
												})
											}
										/>
									</div>
								</section>

						

								<section
									style={{
										display: 'flex',
									}}>
									<div
										style={{
											float: 'left',
											width: '40%',
											padding: '10px',
										}}>
										<div style={{ marginBottom: '15px' }}>
											<label>Nombre del Curso:</label>
										</div>
										<div style={{ marginBottom: '15px' }}>
											<label>Coordinador:</label>
										</div>
										<div style={{ marginBottom: '15px' }}>
											<label>Núm. asistentes</label>
										</div>
									</div>
									<div
										style={{
											float: 'left',
											width: '60%',
											padding: '10px',
										}}>
										<div style={{ marginBottom: '15px' }}>
											<input
												type='text'
												style={{ width: '100%' }}
												value={nuevoRegistro.curso}
												onChange={(event) =>
													setNuevoRegistro({
														...nuevoRegistro,
														curso: event.target.value.toUpperCase(),
													})
												}
											/>
										</div>
										<div style={{ marginBottom: '15px' }}>
											<input
												type='text'
												style={{ width: '52%' }}
												value={nuevoRegistro.coord}
												onChange={(event) =>
													setNuevoRegistro({
														...nuevoRegistro,
														coord: event.target.value.toUpperCase(),
													})
												}
											/>
										</div>
										<div style={{ marginBottom: '15px' }}>
											<input
												type='number'
												style={{ width: '52%' }}
												maxLength='2'
												onChange={(event) =>
													setNuevoRegistro({
														...nuevoRegistro,
														numasist: event.target.value,
													})
												}
											/>
										</div>
									</div>
								</section>
								<section style={{ width: '100%', textAlign: 'center' }}>
									<input
										type='submit'
										value='Guardar'
										disabled={disableButton}
										style={{
											padding: '10px 24px',
											background: disableButton ? 'gray' : '#141414',
											color: '#fff',
											border: 'none',
										}}></input>
								</section>
							</form>
						</ModalContent>
						<CloseModalButton
							aria-label='Close modal'
							onClick={() => setShowModal((prev) => !prev)}
						/>
					</ModalWrapper>
				</Background>
			) : null}
		</>
	);
};

ModalAlta.propTypes = {
	showModal: PropTypes.bool.isRequired,
	setShowModal: PropTypes.func.isRequired,
	setAulaInfo: PropTypes.func.isRequired,
}; */

import React, { useEffect, useState } from 'react';
import { Modal, Button, Select, DatePicker, TimePicker, Input } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import useApiREST from '../../Hooks/useApiREST';
import configJSON from '../config.json';

const { Option } = Select;

export const ModalAlta = ({
  showModal,
  setShowModal,
  setAulaInfo,
  primerdiasemana,
  ultimodiasemana,
}) => {
  const [disableButton, setDisableButton] = useState(true);
  const [aulas, setAulas] = useState([]);
  const [nuevoRegistro, setNuevoRegistro] = useState({});
  const { get } = useApiREST();

  useEffect(() => {
    // Inicializa campos cuando se abre el modal
    setNuevoRegistro({
      nombre: '',
      cveaula: '',
      curso: '',
      // Convertimos a dayjs para que DatePicker/TimePicker funcione fácilmente
      fecini: primerdiasemana ? dayjs(primerdiasemana, 'YYYY-MM-DD') : null,
      fecfin: ultimodiasemana ? dayjs(ultimodiasemana, 'YYYY-MM-DD') : null,
      horaini: dayjs('08:00', 'HH:mm'),
      horafin: dayjs('16:00', 'HH:mm'),
      coord: '',
      numasist: '',
    });
  }, [showModal, primerdiasemana, ultimodiasemana]);

  useEffect(() => {
    // Desactiva botón si faltan datos
    if (
      !nuevoRegistro.nombre ||
      !nuevoRegistro.cveaula ||
      !nuevoRegistro.curso ||
      !nuevoRegistro.coord ||
      !nuevoRegistro.numasist
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [nuevoRegistro]);

  useEffect(() => {
    // Cargar lista de aulas
    get(`${configJSON.API_URL}:${configJSON.PORT}/listaulas`)
      .then((response) => response.json())
      .then((result) => setAulas(result));
  }, [get]);

  const handleOnSubmit = () => {
    // Prepara los valores en formato de string para enviarlos a tu backend
    const feciniStr = nuevoRegistro.fecini?.format('YYYY-MM-DD') || '';
    const fecfinStr = nuevoRegistro.fecfin?.format('YYYY-MM-DD') || '';
    const horainiStr = nuevoRegistro.horaini?.format('HH:mm') || '';
    const horafinStr = nuevoRegistro.horafin?.format('HH:mm') || '';

    // Envía datos al padre y cierra modal
    setAulaInfo({
      ...nuevoRegistro,
      fecini: feciniStr,
      fecfin: fecfinStr,
      horaini: horainiStr,
      horafin: horafinStr,
    });
    setShowModal(false);
  };

  return (
    <Modal
      title="Alta de curso"
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={null}
      destroyOnClose
    >
      {/* AULA */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>Aula:</label>
        <Select
          style={{ width: '100%' }}
          placeholder="Selecciona un aula"
          onChange={(value, option) => {
            setNuevoRegistro({
              ...nuevoRegistro,
              nombre: option.children,
              cveaula: option.key,
            });
          }}
          value={nuevoRegistro.cveaula || undefined}
        >
          {aulas.map((aula) => (
            <Option key={aula.cveaula} value={aula.cveaula}>
              {aula.nombre}
            </Option>
          ))}
        </Select>
      </div>

      {/* FECHAS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Fecha Inicial:</label>
          <DatePicker
            style={{ width: '140px' }}
            format="YYYY-MM-DD"
            value={nuevoRegistro.fecini}
			allowClear={false}
            onChange={(date) => setNuevoRegistro({ ...nuevoRegistro, fecini: date })}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Fecha Final:</label>
          <DatePicker
            style={{ width: '140px' }}
            format="YYYY-MM-DD"
            value={nuevoRegistro.fecfin}
			allowClear={false}
            onChange={(date) => setNuevoRegistro({ ...nuevoRegistro, fecfin: date })}
          />
        </div>
      </div>

      {/* HORAS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Hora Inicial:</label>
          <TimePicker
            style={{ width: '140px' }}
            format="HH:mm"
			allowClear={false}
            value={nuevoRegistro.horaini}
            onChange={(time) => setNuevoRegistro({ ...nuevoRegistro, horaini: time })}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Hora Final:</label>
          <TimePicker
            style={{ width: '140px' }}
            format="HH:mm"
			allowClear={false}
            value={nuevoRegistro.horafin}
            onChange={(time) => setNuevoRegistro({ ...nuevoRegistro, horafin: time })}
          />
        </div>
      </div>

      {/* DATOS DEL CURSO */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>Nombre del Curso:</label>
        <Input
          style={{ width: '100%' }}
          value={nuevoRegistro.curso}
          onChange={(e) =>
            setNuevoRegistro({
              ...nuevoRegistro,
              curso: e.target.value.toUpperCase(),
            })
          }
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>Coordinador:</label>
        <Input
          style={{ width: '100%' }}
          value={nuevoRegistro.coord}
          onChange={(e) =>
            setNuevoRegistro({
              ...nuevoRegistro,
              coord: e.target.value.toUpperCase(),
            })
          }
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>Núm. asistentes:</label>
        <Input
          type="number"
          style={{ width: '100%' }}
          value={nuevoRegistro.numasist}
          onChange={(e) =>
            setNuevoRegistro({
              ...nuevoRegistro,
              numasist: e.target.value,
            })
          }
        />
      </div>

      {/* BOTÓN GUARDAR */}
      <div style={{ textAlign: 'center' }}>
        <Button
          type="primary"
          onClick={handleOnSubmit}
          disabled={disableButton}
        >
          Guardar
        </Button>
      </div>
    </Modal>
  );
};

ModalAlta.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  setAulaInfo: PropTypes.func.isRequired,
  primerdiasemana: PropTypes.string,
  ultimodiasemana: PropTypes.string,
};

