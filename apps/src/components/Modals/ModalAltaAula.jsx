import React, { useEffect, useState } from "react";
import { Modal, Input, InputNumber, Alert } from "antd";
import useApiREST from "../../Hooks/useApiREST";
import configJSON from "../config.json";

export const ModalAltaAula = ({ showModal, setShowModal, onSuccess }) => {
  const { post } = useApiREST();

  const initialForm = {
    cveaula: "",
    cveedif: "",
    nombre: "",
    capaci: null,
    pos: null,
  };

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    setForm(initialForm);
    setError("");
  }, [showModal]);

  const handleCancel = () => setShowModal(false);

  const handleOk = async () => {
    try {
      setError("");

      const cveaula = (form.cveaula ?? "").trim();
      const nombre = (form.nombre ?? "").trim();
      const capaci = Number(form.capaci);
      const pos = Number(form.pos);

      if (!cveaula) { setError("La clave del aula (cveaula) es requerida."); return; }
      if (!nombre)  { setError("El nombre del aula es requerido."); return; }
      if (!Number.isFinite(capaci) || capaci < 0) { setError("La capacidad debe ser un número válido (>= 0)."); return; }
      if (!Number.isFinite(pos) || pos < 0)       { setError("La posición debe ser un número válido (>= 0)."); return; }

      setSaving(true);

      const resp = await post(`${configJSON.API_URL}:${configJSON.PORT}/insertaula`, {
        cveaula,
        cveedif: (form.cveedif ?? "").trim(),
        nombre,
        capaci,
        pos,
      });

      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || "Error al guardar el aula.");
      }

      setShowModal(false);
      if (typeof onSuccess === "function") onSuccess();
    } catch (e) {
      setError(e?.message || "Error al guardar el aula.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label, children) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );

  return (
    <Modal
      title="Nueva aula"
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

      {field("Clave del aula",
        <Input
          value={form.cveaula}
          onChange={(e) => setForm({ ...form, cveaula: e.target.value })}
          placeholder="Ej. A1"
        />
      )}

      {field("Edificio",
        <Input
          value={form.cveedif}
          onChange={(e) => setForm({ ...form, cveedif: e.target.value })}
          placeholder="Ej. Edificio Norte"
        />
      )}

      {field("Nombre",
        <Input
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Nombre del aula"
        />
      )}

      {field("Capacidad",
        <InputNumber
          value={form.capaci}
          onChange={(v) => setForm({ ...form, capaci: v })}
          min={0}
          style={{ width: "100%" }}
          placeholder="Núm. de personas"
        />
      )}

      {field("Posición (orden en tabla)",
        <InputNumber
          value={form.pos}
          onChange={(v) => setForm({ ...form, pos: v })}
          min={0}
          style={{ width: "100%" }}
          placeholder="Ej. 1, 2, 3…"
        />
      )}
    </Modal>
  );
};
