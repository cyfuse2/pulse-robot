import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, Mail, ExternalLink } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const ContactsManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar contatos da API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:3000/contacts");
        if (!response.ok) throw new Error("Falha ao carregar contatos");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Erro ao carregar contatos:", error);
        toast.error("Não foi possível carregar os contatos");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Função para excluir contato
  const handleDeleteContact = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este contato?")) return;
    
    try {
      const response = await fetch(`http://localhost:3000/contacts/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Falha ao excluir contato");
      
      setContacts(contacts.filter(contact => contact.id !== id));
      toast.success("Contato excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      toast.error("Não foi possível excluir o contato");
    }
  };

  // Função para enviar e-mail (simulada)
  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`);
    toast.success(`Preparando e-mail para ${email}`);
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
        <span className="ml-2">Carregando contatos...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Contatos</h2>
      </div>

      {/* Lista de contatos */}
      <div className="overflow-x-auto">
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum contato encontrado
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Nome</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Mensagem</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Data</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.map(contact => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{contact.name}</td>
                  <td className="py-3 px-4 text-sm">{contact.email}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="max-w-xs truncate" title={contact.message}>
                      {contact.message}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {contact.createdAt ? formatDate(contact.createdAt) : "Data não disponível"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSendEmail(contact.email)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Enviar e-mail"
                      >
                        <Mail size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir contato"
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

export default ContactsManagement;