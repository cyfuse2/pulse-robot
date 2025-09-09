import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, Users, Clock, LogOut } from "lucide-react";

// Componentes para as diferentes seções do dashboard
import RobotsManagement from "./components/RobotsManagement";
import TestimonialsManagement from "./components/TestimonialsManagement";
import ContactsManagement from "./components/ContactsManagement";
import WaitlistManagement from "./components/WaitlistManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("robots");
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const authData = localStorage.getItem("adminAuth");
    
    if (!authData) {
      toast.error("Você precisa fazer login para acessar esta página");
      navigate("/admin/login");
      return;
    }
    
    try {
      const parsedAuth = JSON.parse(authData);
      if (!parsedAuth.isAuthenticated) {
        toast.error("Sessão inválida. Faça login novamente.");
        navigate("/admin/login");
        return;
      }
      
      setAdminUser({ username: parsedAuth.username });
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      localStorage.removeItem("adminAuth");
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast.success("Logout realizado com sucesso");
    navigate("/");
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt="Pulse Robot Logo" className="h-8" />
            <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Olá, <span className="font-medium">{adminUser.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm text-gray-600 hover:text-pulse-600 transition-colors"
            >
              <LogOut size={16} className="mr-1" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="robots" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
              <TabsTrigger 
                value="robots" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-pulse-500 data-[state=active]:text-white"
              >
                <Bot size={16} />
                <span>Robôs</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="testimonials" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-pulse-500 data-[state=active]:text-white"
              >
                <MessageSquare size={16} />
                <span>Depoimentos</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="contacts" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-pulse-500 data-[state=active]:text-white"
              >
                <Users size={16} />
                <span>Contatos</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="waitlist" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-pulse-500 data-[state=active]:text-white"
              >
                <Clock size={16} />
                <span>Lista de Espera</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <TabsContent value="robots">
              <RobotsManagement />
            </TabsContent>
            
            <TabsContent value="testimonials">
              <TestimonialsManagement />
            </TabsContent>
            
            <TabsContent value="contacts">
              <ContactsManagement />
            </TabsContent>
            
            <TabsContent value="waitlist">
              <WaitlistManagement />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;