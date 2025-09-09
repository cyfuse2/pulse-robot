import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Check, X, Loader2 } from "lucide-react";

interface Robot {
  id: number;
  model: string;
  version: string;
  height: string;
  weight: string;
  capacity: string;
  uptime: string;
  movement: string;
  features: string[];
  description: string;
  image: string;
  available: boolean;
}

const RobotsManagement = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRobot, setEditingRobot] = useState<Robot | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newRobot, setNewRobot] = useState<Omit<Robot, "id">>({  
    model: "",
    version: "",
    height: "",
    weight: "",
    capacity: "",
    uptime: "",
    movement: "",
    features: [],
    description: "",
    image: "/robot-showcase.png",
    available: true
  });

  // Carregar robôs da API
  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await fetch("http://localhost:3000/robots");
        if (!response.ok) throw new Error("Falha ao carregar robôs");
        const data = await response.json();
        setRobots(data);
      } catch (error) {
        console.error("Erro ao carregar robôs:", error);
        toast.error("Não foi possível carregar os robôs");
      } finally {
        setLoading(false);
      }
    };

    fetchRobots();
  }, []);

  // Funções para gerenciar robôs
  const handleEditRobot = (robot: Robot) => {
    setEditingRobot({ ...robot });
  };

  const handleCancelEdit = () => {
    setEditingRobot(null);
  };

  const handleSaveEdit = async () => {
    if (!editingRobot) return;
    
    try {
      const response = await fetch(`http://localhost:3000/robots/${editingRobot.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRobot)
      });
      
      if (!response.ok) throw new Error("Falha ao atualizar robô");
      
      const updatedRobot = await response.json();
      setRobots(robots.map(robot => robot.id === updatedRobot.id ? updatedRobot : robot));
      setEditingRobot(null);
      toast.success("Robô atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar robô:", error);
      toast.error("Não foi possível atualizar o robô");
    }
  };

  const handleDeleteRobot = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este robô?")) return;
    
    try {
      const response = await fetch(`http://localhost:3000/robots/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Falha ao excluir robô");
      
      setRobots(robots.filter(robot => robot.id !== id));
      toast.success("Robô excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir robô:", error);
      toast.error("Não foi possível excluir o robô");
    }
  };

  const handleAddRobot = async () => {
    try {
      const response = await fetch("http://localhost:3000/robots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRobot)
      });
      
      if (!response.ok) throw new Error("Falha ao adicionar robô");
      
      const addedRobot = await response.json();
      setRobots([...robots, addedRobot]);
      setIsAdding(false);
      setNewRobot({
        model: "",
        version: "",
        height: "",
        weight: "",
        capacity: "",
        uptime: "",
        movement: "",
        features: [],
        description: "",
        image: "/robot-showcase.png",
        available: true
      });
      toast.success("Robô adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar robô:", error);
      toast.error("Não foi possível adicionar o robô");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingRobot) return;
    
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === "features") {
      setEditingRobot({
        ...editingRobot,
        features: value.split(",").map(feature => feature.trim())
      });
    } else if (name === "available") {
      setEditingRobot({
        ...editingRobot,
        available: type === "checkbox" ? (e.target as HTMLInputElement).checked : Boolean(value)
      });
    } else {
      setEditingRobot({
        ...editingRobot,
        [name]: value
      });
    }
  };

  const handleNewRobotChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === "features") {
      setNewRobot({
        ...newRobot,
        features: value.split(",").map(feature => feature.trim())
      });
    } else if (name === "available") {
      setNewRobot({
        ...newRobot,
        available: type === "checkbox" ? (e.target as HTMLInputElement).checked : Boolean(value)
      });
    } else {
      setNewRobot({
        ...newRobot,
        [name]: value
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-pulse-500" />
        <span className="ml-2">Carregando robôs...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Robôs</h2>
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
              Adicionar Robô
            </>
          )}
        </button>
      </div>

      {/* Formulário para adicionar novo robô */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Adicionar Novo Robô</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                name="model"
                value={newRobot.model}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versão</label>
              <input
                type="text"
                name="version"
                value={newRobot.version}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Altura</label>
              <input
                type="text"
                name="height"
                value={newRobot.height}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
              <input
                type="text"
                name="weight"
                value={newRobot.weight}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade</label>
              <input
                type="text"
                name="capacity"
                value={newRobot.capacity}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de Operação</label>
              <input
                type="text"
                name="uptime"
                value={newRobot.uptime}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Movimento</label>
              <input
                type="text"
                name="movement"
                value={newRobot.movement}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponível</label>
              <select
                name="available"
                value={newRobot.available ? "true" : "false"}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recursos (separados por vírgula)</label>
              <input
                type="text"
                name="features"
                value={newRobot.features.join(", ")}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                name="description"
                value={newRobot.description}
                onChange={handleNewRobotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                rows={2}
              />
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
              onClick={handleAddRobot}
              className="px-4 py-2 bg-pulse-500 text-white rounded-md hover:bg-pulse-600 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Lista de robôs */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versão</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponível</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {robots.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Nenhum robô encontrado
                </td>
              </tr>
            ) : (
              robots.map(robot => (
                <tr key={robot.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRobot && editingRobot.id === robot.id ? (
                      <input
                        type="text"
                        name="model"
                        value={editingRobot.model}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                      />
                    ) : (
                      robot.model
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRobot && editingRobot.id === robot.id ? (
                      <input
                        type="text"
                        name="version"
                        value={editingRobot.version}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                      />
                    ) : (
                      robot.version
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingRobot && editingRobot.id === robot.id ? (
                      <input
                        type="text"
                        name="description"
                        value={editingRobot.description}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 max-w-xs truncate">{robot.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRobot && editingRobot.id === robot.id ? (
                      <select
                        name="available"
                        value={editingRobot.available ? "true" : "false"}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pulse-500"
                      >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${robot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {robot.available ? "Sim" : "Não"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingRobot && editingRobot.id === robot.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRobot(robot)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteRobot(robot.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RobotsManagement;