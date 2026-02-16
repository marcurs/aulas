/* import React, { useRef, useState, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { Background, ModalWrapperEliminar } from './modal';
import AppContext from '../../context/AppContext';
import configJSON from '../config.json';
//import { API_URL, PORT } from '@env';

export const ModalSignIn = ({ showModal, setShowModal }) => {
	const modalRef = useRef();
	const [username, setUserName] = useState();
	const [password, setPassword] = useState();
	const [accepted, setAccepted] = useState('none');

	const { setToken } = useContext(AppContext);

	async function loginUser(credentials) {
		return fetch(`${configJSON.API_URL}:${configJSON.PORT}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		})
			.then((data) => {
				!data.ok && setAccepted('inline');
				return data.ok ? data.json() : '';
			})
			.catch(() => {
				setAccepted('inline');
			});
	}

	const handleSubmit = async () => {
		const token = await loginUser({
			username,
			password,
		});

		if (token) {
			axios
				.get(`${configJSON.API_URL}:${configJSON.PORT}/verifyToken`, {
					params: { token: token.token },
				})
				.then(() => {
					setAccepted('none');
					setToken(token);
					setShowModal(false);
				})
				.catch(() => {
					setAccepted('inline');
				});
		}
	};

	return (
		<>
			{showModal && (
				<Background ref={modalRef}>
					<ModalWrapperEliminar showModal={showModal}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								marginLeft: '50px',
								marginRight: '50px',
								marginTop: '20px',
							}}>
							<h4 style={{ margin: '0px 0px 20px 0px', textAlign: 'center' }}>
								ADMINISTRACION DE AULAS
							</h4>
							<div style={{ display: 'flex', marginBottom: '15px' }}>
								<label>
									Usuario:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								</label>
								<input
									style={{ width: '100%' }}
									onChange={(event) => setUserName(event.target.value)}
								/>
							</div>
							<div style={{ display: 'flex', marginBottom: '25px' }}>
								<label>Contraseña:&nbsp;&nbsp;</label>
								<input
									type='password'
									style={{ width: '100%' }}
									onChange={(event) => setPassword(event.target.value)}
								/>
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: '5px',
								}}>
								<button
									style={{ width: '100px' }}
									type='button'
									onClick={() => {
										handleSubmit();
									}}>
									Entrar
								</button>
								<button
									style={{ width: '100px' }}
									type='button'
									onClick={() => {
										setAccepted('none');
										setShowModal((prev) => !prev);
									}}>
									Cancelar
								</button>
							</div>
							<h4
								style={{
									margin: '0px',
									textAlign: 'center',
									display: accepted,
								}}>
								Usuario/Password Invalido!!
							</h4>
						</div>
					</ModalWrapperEliminar>
				</Background>
			)}
		</>
	);
};

ModalSignIn.propTypes = {
	showModal: PropTypes.bool.isRequired,
	setShowModal: PropTypes.func.isRequired,
}; */

import React, { useState, useContext } from 'react';
import { Modal, Button, Input } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import AppContext from '../../context/AppContext';
import configJSON from '../config.json';

export const ModalSignIn = ({ showModal, setShowModal }) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState('none');
  const { setToken } = useContext(AppContext);

  // Lógica de login (igual que antes)
  async function loginUser(credentials) {
    return fetch(`${configJSON.API_URL}:${configJSON.PORT}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
      .then((data) => {
        if (!data.ok) {
          setAccepted('inline');
          return null;
        }
        return data.json();
      })
      .catch(() => {
        setAccepted('inline');
        return null;
      });
  }

  const handleSubmit = async () => {
    const tokenResponse = await loginUser({ username, password });
    if (tokenResponse) {
      axios
        .get(`${configJSON.API_URL}:${configJSON.PORT}/verifyToken`, {
          params: { token: tokenResponse.token },
        })
        .then(() => {
          setAccepted('none');
          setToken(tokenResponse);
          setShowModal(false);
        })
        .catch(() => {
          setAccepted('inline');
        });
    }
  };

  return (
    <Modal
		title="ADMINISTRACIÓN DE AULAS"
		open={showModal}              // Si usas AntD < 5, usa: visible={showModal}
		//style={{ backgroundColor: '#ddd' }}
		onCancel={() => {
        setAccepted('none');
        setShowModal(false);
      }}
      footer={null}                 // Quita botones por defecto de AntD
      destroyOnClose
    >
      <div style={{ marginBottom: '15px' }}>
        <label>Usuario:</label>
        <Input
          style={{ marginTop: '5px' }}
          onChange={(e) => setUserName(e.target.value)}
          value={username}
        />
      </div>
      <div style={{ marginBottom: '25px' }}>
        <label>Contraseña:</label>
        <Input.Password
          style={{ marginTop: '5px' }}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" onClick={handleSubmit} style={{ width: '100px' }}>
          Entrar
        </Button>
        <Button
          style={{ width: '100px' }}
          onClick={() => {
            setAccepted('none');
            setShowModal(false);
          }}
        >
          Cancelar
        </Button>
      </div>

      {/* Mensaje de error */}
      {accepted === 'inline' && (
        <h4 style={{ marginTop: '15px', textAlign: 'center', color: 'red' }}>
          ¡Usuario/Contraseña inválidos!
        </h4>
      )}
    </Modal>
  );
};

ModalSignIn.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

