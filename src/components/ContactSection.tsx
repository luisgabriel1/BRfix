import React, { useState } from "react";

// URL do seu backend (defina VITE_API_URL no .env do frontend)
const API_URL = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";

type FileWithId = { id: string; file: File };

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [loading, setLoading] = useState(false);

  function makeId() {
    // id simples para chaveamento em listas
    return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  }

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    const newFiles = Array.from(fileList).map((f) => ({ id: makeId(), file: f }));
    setFiles((prev) => [...prev, ...newFiles]);
    // limpa o input para permitir re-upload do mesmo arquivo se desejado
    e.currentTarget.value = "";
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Se não houver arquivos, enviamos JSON simples
      if (files.length === 0) {
        const res = await fetch(`${API_URL}/send-form`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Erro desconhecido");
      } else {
        // Se houver arquivos, enviamos multipart/form-data
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("message", message);
        files.forEach((f) => formData.append("files", f.file));

        const res = await fetch(`${API_URL}/send-form`, {
          method: "POST",
          body: formData, // NÃO setar Content-Type aqui — o browser define o boundary
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Erro desconhecido");
      }

      alert("Formulário enviado com sucesso!");
      setName("");
      setEmail("");
      setMessage("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Contato</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="seu@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mensagem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Escreva sua mensagem"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Anexos (opcional)</label>
          <input type="file" multiple onChange={handleFilesChange} className="block" />

          {files.length > 0 && (
            <ul className="mt-2 space-y-2">
              {files.map((f) => (
                <li key={f.id} className="flex items-center justify-between border rounded p-2">
                  <div className="truncate">{f.file.name} <span className="text-xs text-gray-500">({Math.round(f.file.size/1024)} KB)</span></div>
                  <button type="button" onClick={() => removeFile(f.id)} className="ml-3 px-2 py-1 rounded bg-red-50 text-red-700">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded bg-black text-white px-4 py-2 disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </section>
  );
}