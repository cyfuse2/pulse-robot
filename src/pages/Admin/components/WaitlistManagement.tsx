import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, Mail, Download } from "lucide-react";

interface WaitlistEntry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  isDemo?: boolean;
  company?: string;
}

const WaitlistManagement = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar lista de espera da API
  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const response = await fetch("http://localhost:3000/waitlist");
        if (!response.ok) throw new Error("Falha ao carregar lista de espera");
        const data = await response.json();
        setWaitlist(data);
      } catch (error) {
        console.error("Erro ao carregar lista de espera:", error);
        toast.error("Não foi possível carregar a lista de espera");
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, []);

  // Função para excluir entrada da lista de espera
  const handleDeleteEntry = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta entrada da lista de espera?")) return;
    
    try {
      const response = await fetch(`http://localhost:3000/waitlist/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Falha ao excluir entrada da lista de espera");
      
      setWaitlist(waitlist.filter(entry => entry.id !== id));
      toast.success("Entrada removida com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir entrada da lista de espera:", error);
      toast.error("Não foi possível excluir a entrada");
    }
  };

  // Função para enviar e-mail (simulada)
  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`);
    toast.success(`Preparando e-mail para ${email}`);
  };

  // Função para exportar lista de espera como CSV
  const handleExportCSV = () => {
    if (waitlist.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }

    // Criar conteúdo CSV
    const headers = ["ID", "Nome", "Email", "Telefone", "Empresa", "Tipo", "Data de Cadastro"];
    const csvContent = [
      headers.join(","),
      ...waitlist.map(entry => [
        entry.id,
        `"${entry.name.replace(/"/g, '""')}"`,
        `"${entry.email.replace(/"/g, '""')}"`,
        `"${entry.phone ? entry.phone.replace(/"/g, '""') : ''}"`,
        `"${entry.company ? entry.company.replace(/"/g, '""') : ''}"`,
        `"${entry.isDemo ? 'Demonstração' : 'Lista de Espera'}"`,
        `"${entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ''}"`,
      ].join(","))
    ].join("\n");

    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lista-espera-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Lista de espera exportada com sucesso!");
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-pulse-500" />
        <span className="ml-2">Carregando lista de espera...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lista de Espera</h2>
        <button
          onClick={handleExportCSV}
          className="flex items-center px-4 py-2 bg-pulse-500 text-white rounded-md hover:bg-pulse-600 transition-colors"
        >
          <Download size={16} className="mr-2" />
          Exportar CSV
        </button>
      </div>

      {/* Lista de espera */}
      <div className="overflow-x-auto">
        {waitlist.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma entrada na lista de espera
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Nome</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Telefone</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Empresa</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Tipo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Data de Cadastro</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {waitlist.map(entry => (
                <tr key={entry.id} className={`hover:bg-gray-50 ${entry.isDemo ? 'bg-blue-50' : ''}`}>
                  <td className="py-3 px-4 text-sm">{entry.name}</td>
                  <td className="py-3 px-4 text-sm">{entry.email}</td>
                  <td className="py-3 px-4 text-sm">{entry.phone || "Não informado"}</td>
                  <td className="py-3 px-4 text-sm">{entry.company || "Não informado"}</td>
                  <td className="py-3 px-4 text-sm">
                    {entry.isDemo ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Demonstração
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Lista de Espera
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {entry.createdAt ? formatDate(entry.createdAt) : "Data não disponível"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSendEmail(entry.email)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Enviar e-mail"
                      >
                        <Mail size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir da lista"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WaitlistManagement;