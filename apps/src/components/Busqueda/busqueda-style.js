import styled from 'styled-components';

export const SeccionBusqueda = styled.div`
	overflow: hidden;
	position: sticky;
	top: 0px;
	width: 100%;
	display: flex;
	height: 40px;
	margin-bottom: 8px;
	//background-color: #d3d3d3;
	//border-radius: 10px;
`;

export const FechaSeleccion = styled.input.attrs({ type: 'date' })`
	height: 35px;
	width: 320px;
	margin-right: 2px;
	text-align: center;
	text-justify: inner-word;
`;

export const BotonBusquedaFecha = styled.button`
	position: static;
	margin: 0;
	height: 40px;
`;
