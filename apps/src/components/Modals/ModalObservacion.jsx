import React, { useContext, useEffect, useState } from "react";
import { Modal, Radio, Input, Button, Alert } from "antd";
import AppContext from "../../context/AppContext";
import useApiREST from "../../Hooks/useApiREST";
import configJSON from "../config.json";

const { TextArea } = Input;

export const ModalObservacion = ({ showModal, setShowModal, onSuccess }) => {
  const { selcursosO, seleccionaCursoObservacion } = useContext(AppContext);
  const { post } = useApiREST();

  const [estado, setEstado] = useState(1); // Programada
  const [observador, setObservador] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showModal) return;

    setError("");

    if (!selcursosO || selcursosO.length === 0) {
      // Si por alguna razón abren sin selección
      setEstado(1);
      setObservador("");
      setComentarios("");
      return;
    }

    // Helper: si todos tienen el mismo valor, regresa ese valor; si no, null
    const sameValueOrNull = (arr, getter) => {
      const values = arr.map(getter);
      const first = values[0];
      const allSame = values.every((v) => (v ?? "") === (first ?? ""));
      return allSame ? first : null;
    };

    const estadoSame = sameValueOrNull(selcursosO, (x) =>
      Number(x.observacion_estado ?? 1),
    );
    const observadorSame = sameValueOrNull(
      selcursosO,
      (x) => x.observador_nombre ?? "",
    );
    const comentariosSame = sameValueOrNull(
      selcursosO,
      (x) => x.observacion_comentarios ?? "",
    );

    // Si solo es 1, todo se precarga sí o sí.
    // Si son varios, solo se precarga si todos coinciden; si no, se deja vacío.
    setEstado(estadoSame ?? 1);
    setObservador(observadorSame ?? "");
    setComentarios(comentariosSame ?? "");
  }, [showModal, selcursosO]);

  const handleGuardar = async () => {
    setError("");

    if (estado === 2 && !observador.trim()) {
      setError(
        "Para marcar como OBSERVADO es obligatorio capturar el nombre del observador.",
      );
      return;
    }

    const ids = selcursosO.map((c) => c.cvecurso);

    const payload = {
      ids,
      observacion_estado: estado,
      observador_nombre: observador.trim() || null,
      observacion_comentarios: comentarios.trim() || null,
    };

    const resp = await post(
      `${configJSON.API_URL}:${configJSON.PORT}/updateobservacion`,
      payload,
    );

    if (resp.ok) {
      seleccionaCursoObservacion([]);
      setShowModal(false);
      onSuccess?.();
    } else {
      setError("No se pudo guardar la observación.");
    }
  };

  return (
    <Modal
      open={showModal}
      title="Observación"
      onCancel={() => setShowModal(false)}
      footer={null}
      destroyOnClose
      centered
    >
      <div style={{ marginBottom: 10 }}>
        Se aplicará a <b>{selcursosO.length}</b> curso(s) seleccionados
      </div>

      <div style={{ marginBottom: 16 }}>
        <b>Estado</b>
        <Radio.Group
          value={estado}
          onChange={(e) => setEstado(Number(e.target.value))}
          style={{ display: "flex", flexDirection: "column", marginTop: 8 }}
        >
          <Radio value={0}>No aplica</Radio>
          <Radio value={1}>Programada</Radio>
          <Radio value={2}>Observado</Radio>
          <Radio value={3}>No observado</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginBottom: 16 }}>
        <b>Observador (obligatorio si es Observado)</b>
        <Input
          value={observador}
          onChange={(e) => setObservador(e.target.value)}
          placeholder="Nombre del observador"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <b>Comentarios</b>
        <TextArea
          rows={4}
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          placeholder="Comentarios (opcional)"
        />
      </div>

      {error && <Alert type="error" message={error} showIcon />}

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
      >
        <Button onClick={() => setShowModal(false)} style={{ marginRight: 8 }}>
          Cancelar
        </Button>
        <Button
          type="primary"
          onClick={handleGuardar}
          disabled={selcursosO.length === 0}
        >
          Guardar
        </Button>
      </div>
    </Modal>
  );
};
