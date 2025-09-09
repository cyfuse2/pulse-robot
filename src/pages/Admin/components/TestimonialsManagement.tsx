import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Check, X, Loader2 } from "lucide-react";

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  company: string;
}

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, "id">>({  
    content: "",
    author: "",
    role: "",
    company: ""
  });

  // Carregar depoimentos da API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("http://localhost:3000/testimonials");
        if (!response.ok) throw new Error("Falha ao carregar depoimentos");
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Erro ao carregar depoimentos:", error);
        toast.error("Não foi possível carregar os depoimentos");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Funções para gerenciar depoimentos
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial({ ...testimonial });
  };

  const handleCancelEdit = () => {
    setEditingTestimonial(null);
  };

  const handleSaveEdit = async () => {
    if (!editingTestimonial) return;
    
    try {
      const response = await fetch(`http://localhost:3000/testimonials/${editingTestimonial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTestimonial)
      });
      
      if (!response.ok) throw new Error("Falha ao atualizar depoimento");
      
      const updatedTestimonial = await response.json();
      setTestimonials(testimonials.map(testimonial => 
        testimonial.id === updatedTestimonial.id ? updatedTestimonial : testimonial
      ));
      setEditingTestimonial(null);
      toast.success("Depoimento atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar depoimento:", error);
      toast.error("Não foi possível atualizar o depoimento");
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    
    try {
      const response = await fetch(`http://localhost:3000/testimonials/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Falha ao excluir depoimento");
      
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      toast.success("Depoimento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir depoimento:", error);
      toast.error("Não foi possível excluir o depoimento");
    }
  };

  const handleAddTestimonial = async () => {
    try {
      const response = await fetch("http://localhost:3000/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial)
      });
      
      if (!response.ok) throw new Error("Falha ao adicionar depoimento");
      
      const addedTestimonial = await response.json();
      setTestimonials([...testimonials, addedTestimonial]);
      setIsAdding(false);
      setNewTestimonial({
        content: "",
        author: "",
        role: "",
        company: ""
      });
      toast.success("Depoimento adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar depoimento:", error);
      toast.error("Não foi possível adicionar o depoimento");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingTestimonial) return;
    
    const { name, value } = e.target;
    
    setEditingTestimonial({
      ...editingTestimonial,
      [name]: value
    });
  };

  const handleNewTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setNewTestimonial({
      ...newTestimonial,
      [name]: value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-pulse-500" />
        <span className="ml-2">Carregando depoimentos...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Depoimentos</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-pulse-500 text-white rounded-md hover:bg-pulse-600 transition-colors"
        >
          {isAdding ? (
            <>
              <X size={16} className="mr-2" />
              Cancelar
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              Adicionar Depoimento
            </>
          )}
        </button>
      </div>

      {/* Formulário para adicionar novo depoimento */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Adicionar Novo Depoimento</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
              <textarea
                name="content"
                value={newTestimonial.content}
                onChange={handleNewTestimonialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input
                  type="text"
                  name="author"
                  value={newTestimonial.author}
                  onChange={handleNewTestimonialChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input
                  type="text"
                  name="role"
                  value={newTestimonial.role}
                  onChange={handleNewTestimonialChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  name="company"
                  value={newTestimonial.company}
                  onChange={handleNewTestimonialChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-700 mr-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddTestimonial}
              className="px-4 py-2 bg-pulse-500 text-white rounded-md hover:bg-pulse-600 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Lista de depoimentos */}
      <div className="space-y-6">
        {testimonials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum depoimento encontrado
          </div>
        ) : (
          testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
              {editingTestimonial && editingTestimonial.id === testimonial.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                    <textarea
                      name="content"
                      value={editingTestimonial.content}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                      <input
                        type="text"
                        name="author"
                        value={editingTestimonial.author}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                      <input
                        type="text"
                        name="role"
                        value={editingTestimonial.role}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                      <input
                        type="text"
                        name="company"
                        value={editingTestimonial.company}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-pulse-500 text-white rounded-md hover:bg-pulse-600 transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <p className="text-gray-800 mb-3">"{testimonial.content}"</p>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTestimonial(testimonial)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;