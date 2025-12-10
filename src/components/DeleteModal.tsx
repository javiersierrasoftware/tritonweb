"use client";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  count,
  itemType = "elemento", // Default to "elemento"
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  itemType?: string; // Optional prop
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold">Confirmar eliminación</h2>
        <p className="text-gray-400">
          ¿Seguro que quieres eliminar{" "}
          <b>{count > 1 ? `${count} ${itemType}s` : `este ${itemType}`}</b>?
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}