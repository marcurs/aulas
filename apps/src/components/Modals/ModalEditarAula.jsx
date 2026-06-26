// /src/components/Modals/ModalEditarAula.jsx
import React, { useEffect, useState } from "react";
import { Modal, Input, InputNumber, Alert } from "antd";
import useApiREST from "../../Hooks/useApiREST";
import configJSON from "../config.json";

export const ModalEditarAula = ({
  showModal,
  setShowModal,
  aula,
  onSuccess,
}) => {
  const { post } = useApiREST();

  const [nombre, setNombre] = useState("");
  const [capaci, setCapaci] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!showModal) return;

    setError("");
    setNombre(aula?.nombre ?? "");
    setCapaci(
      typeof aula?.capaci === "number"
        ? aula.capaci
        : Number(aula?.capaci ?? 0),
    );
  }, [showModal, aula]);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleOk = async () => {
    try {
      setError("");

      const cveaula = (aula?.cveaula ?? "").toString().trim();
      if (!cveaula) {
        setError("No se encontró la clave del aula (cveaula).");
        return;
      }

      const nombreTrim = (nombre ?? "").trim();
      const capaciNum = Number(capaci);

      if (!cveaula) {
        setError("No se encontró la clave del aula (cveaula).");
        return;
      }
      if (!nombreTrim) {
        setError("El nombre del aula es requerido.");
        return;
      }
      if (!Number.isFinite(capaciNum) || capaciNum < 0) {
        setError("La capacidad debe ser un número válido (>= 0).");
        return;
      }

      setSaving(true);

      const url = `${configJSON.API_URL}:${configJSON.PORT}/updateaula`;
      const resp = await post(url, {
        cveaula,
        nombre: nombreTrim,
        capaci: capaciNum,
      });

      // Tu useApiREST.post devuelve fetch() -> hay que checar ok
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || "Error al actualizar el aula.");
      }

      setShowModal(false);
      if (typeof onSuccess === "function") onSuccess();
    } catch (e) {
      setError(e?.message || "Error al guardar cambios del aula.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Editar aula"
      open={showModal}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Guardar"
      cancelText="Cancelar"
      confirmLoading={saving}
      destroyOnClose
    >
      {error ? (
        <Alert
          type="error"
          message="No se pudo guardar"
          description={error}
          showIcon
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Nombre</div>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del aula"
        />
      </div>

      <div>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Capacidad</div>
        <InputNumber
          value={capaci}
          onChange={(v) => setCapaci(v)}
          min={0}
          style={{ width: "100%" }}
          placeholder="Capacidad"
        />
      </div>

      {/* Opcional: mostrar cveaula en solo lectura */}
      {/* <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>cveaula: {aula?.cveaula}</div> */}
    </Modal>
  );
};
