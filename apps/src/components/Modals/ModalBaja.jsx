/* import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
	Background,
	ModalWrapperEliminar,
	ModalContentEliminar,
	CloseModalButton,
} from './modal';

export const ModalBaja = ({ showModal, setShowModal, respuesta }) => {
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

	return (
		<>
			{showModal ? (
				<Background ref={modalRef}>
					<ModalWrapperEliminar showModal={showModal}>
						<div
							style={{
								textAlign: 'center',
								fontSize: '20px',
								marginTop: '60px',
							}}>
							<h5>Esta seguro que desea ELIMINAR los cursos?</h5>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-around' }}>
							<button
								input='text'
								style={{
									padding: '10px 24px',
									background: '#590d22',
									color: 'white',
									border: 'none',
								}}
								onClick={() => {
									respuesta(true);
									setShowModal(false);
								}}>
								Aceptar
							</button>
							<button
								input='text'
								style={{
									padding: '10px 24px',
									background: 'lightgray',
									color: 'black',
									border: 'none',
								}}
								onClick={() => {
									respuesta(false);
									setShowModal(false);
								}}>
								Cancelar
							</button>
						</div>
					</ModalWrapperEliminar>
				</Background>
			) : null}
		</>
	);
};

ModalBaja.propTypes = {
	showModal: PropTypes.bool.isRequired,
	setShowModal: PropTypes.func.isRequired,
	respuesta: PropTypes.func.isRequired,
}; */

import React from 'react';
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';

export const ModalBaja = ({ showModal, setShowModal, respuesta }) => {
  // "respuesta" es la función que maneja la confirmación o cancelación
  const handleAceptar = () => {
    respuesta(true);
    setShowModal(false);
  };

  const handleCancelar = () => {
    respuesta(false);
    setShowModal(false);
  };

  return (
    <Modal
      title="Eliminar Cursos"
      open={showModal}
      onCancel={handleCancelar}
      footer={null}   // Personalizamos los botones
      destroyOnClose
    >
      <h4 style={{ textAlign: 'center', margin: '20px 0' }}>
        ¿Está seguro de que desea ELIMINAR los cursos?
      </h4>

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          type="primary"
          danger
          onClick={handleAceptar}
        >
          Aceptar
        </Button>
        <Button onClick={handleCancelar}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
};

ModalBaja.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  respuesta: PropTypes.func.isRequired,
};
