import React from 'react';

const Encabezado = () => {
	return (
		<div
			style={{
				width: '100%',
				textAlign: 'center',
				backgroundColor: '#0077b6',
				color: 'white',
//				marginTop: '-20px',
				marginBottom: '8px',
//				paddingTop: '10px',
				border: '2px solid black',
				borderRadius: '10px'
			}}>
			<p style={{ fontSize: '35px' }}>CENTRO DE ENTRENAMIENTO</p>
			<p
				style={{
					fontSize: '18px',
					paddingBottom: '20px',
					margin: '-40px 0px 10px 0px',
				}}>
				PROGRAMA DE AULAS
			</p>
		</div>
	);
};

export default Encabezado;
