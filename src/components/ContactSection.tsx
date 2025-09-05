import React, { useState } from "react";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      description: formData.get("description"),
      observations: formData.get("observations"),
    };

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("✅ Mensagem enviada com sucesso!");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("❌ Erro: " + (result.error || "Falha ao enviar."));
      }
    } catch (error) {
      setStatus("❌ Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Entre em Contato</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="tel" name="phone" placeholder="Telefone" required />
        <input type="text" name="address" placeholder="CEP" required />
        <textarea name="description" placeholder="Descreva seu projeto" required />
        <textarea name="observations" placeholder="Observações (opcional)" />

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {status && <p>{status}</p>}
    </section>
  );
}
