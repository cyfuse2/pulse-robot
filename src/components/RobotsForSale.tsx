import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Robot {
  id: string;
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
  price?: number; // Adicionando preço para venda
}

const RobotsForSale = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Preços fictícios para os robôs
  const robotPrices: Record<string, number> = {
    "Atlas": 149999.99,
    "Nexus": 199999.99,
    "Orion": 179999.99,
    // Preços padrão para outros modelos
    "default": 159999.99
  };

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await fetch("http://localhost:3000/robots");
        if (!response.ok) {
          throw new Error("Falha ao carregar os robôs");
        }
        const data = await response.json();
        
        // Adicionar preços aos robôs
        const robotsWithPrices = data.map((robot: Robot) => ({
          ...robot,
          price: robotPrices[robot.model] || robotPrices.default
        }));
        
        // Filtrar apenas robôs disponíveis para venda
        const availableRobots = robotsWithPrices.filter((robot: Robot) => robot.available);
        
        setRobots(availableRobots);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar os robôs. Por favor, tente novamente mais tarde.");
        setLoading(false);
        console.error("Erro ao buscar robôs:", err);
      }
    };

    fetchRobots();
  }, []);

  // Formatar preço em reais
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-pulse-500" />
        <span className="ml-2">Carregando robôs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full py-20 bg-white" id="robots-for-sale">
      <div className="container px-6 lg:px-8 mx-auto">
        <div className="flex flex-col items-center">
          <div className="mb-12 text-center">
            <div className="pulse-chip mb-4">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
              <span>Nossos Produtos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              Robôs <span className="text-[#FC4D0A]">Disponíveis</span> para Compra
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conheça nossa linha de robôs humanoides de última geração, projetados para revolucionar sua vida e negócios.
            </p>
          </div>
          
          {robots.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-xl text-gray-600">Nenhum robô disponível para venda no momento.</p>
              <p className="mt-2">Entre em contato conosco para mais informações sobre lançamentos futuros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {robots.map((robot) => (
                <div key={robot.id} className="bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-hover transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={robot.image.startsWith('/') ? `/robot-images/${robot.model.toLowerCase()}.jpg` : `http://localhost:8080/robot-images/hero-image.jpg`} 
                      alt={`Robô ${robot.model}`} 
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/robot-images/hero-image.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-pulse-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Disponível
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">{robot.model}</h3>
                        <p className="text-gray-500">Versão {robot.version}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-pulse-500">{formatPrice(robot.price || 0)}</p>
                        <p className="text-sm text-gray-500">À vista ou em até 12x</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{robot.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">ESPECIFICAÇÕES</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-pulse-100 rounded-full mr-2"></span>
                          <span>Altura: {robot.height}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-pulse-100 rounded-full mr-2"></span>
                          <span>Peso: {robot.weight}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-pulse-100 rounded-full mr-2"></span>
                          <span>Capacidade: {robot.capacity}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-pulse-100 rounded-full mr-2"></span>
                          <span>Autonomia: {robot.uptime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {robot.features.map((feature, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-4">
                      <button className="flex-1 bg-pulse-500 hover:bg-pulse-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300">
                        Comprar Agora
                      </button>
                      <button className="flex-1 border border-pulse-500 text-pulse-500 hover:bg-pulse-50 font-medium py-3 px-4 rounded-lg transition-colors duration-300">
                        Mais Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12">
            <button className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-300">
              Ver Todos os Modelos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RobotsForSale;