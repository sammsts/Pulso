import { useState } from "react";
import { XCircle } from "lucide-react";

export function ErrorMask({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-lg p-6 shadow-xl text-center max-w-sm flex flex-col items-center gap-4">
        <XCircle className="text-red-600 w-10 h-10" />
        <p className="text-red-700 font-medium">{message}</p>
        <button
          onClick={() => setVisible(false)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
