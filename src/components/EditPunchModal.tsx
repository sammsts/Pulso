import { useState, useEffect } from "react";

interface Punch {
  timestamp: string;
  type: number;
  [key: string]: any;
}

interface EditPunchModalProps {
  punch: Punch;
  onClose: () => void;
  onSave: (updatedPunch: Punch) => void;
}

export function EditPunchModal({ punch, onClose, onSave }: EditPunchModalProps) {
  const toLocalISOString = (dateStr: string) => {
    const date = new Date(dateStr);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [timestamp, setTimestamp] = useState(toLocalISOString(punch.timestamp));
  const [type, setType] = useState(punch.type);

  useEffect(() => {
    setTimestamp(toLocalISOString(punch.timestamp));
    setType(punch.type);
  }, [punch]);

  function handleSave() {
    onSave({
      ...punch,
      timestamp: new Date(timestamp).toISOString(),
      type,
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-80 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Editar Ponto</h2>
        <label className="block mb-2">
          Data e Hora:
          <input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </label>
        <label className="block mb-4">
          Tipo:
          <select
            value={type}
            onChange={(e) => setType(Number(e.target.value))}
            className="w-full border rounded px-2 py-1 mt-1"
          >
            <option value={0}>Entrada</option>
            <option value={1}>Saída</option>
          </select>
        </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
