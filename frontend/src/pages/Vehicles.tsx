import { useState, useEffect } from 'react';
import { vehicleApi } from '../services/api';
import { Car, AlertCircle, Loader2, Tag } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  dailyRate: number;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: string;
  plate: string;
  dailyRate: number;
  status: string;
  categoryName: string;
}

export function Vehicles() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [catRes, vehRes] = await Promise.all([
        vehicleApi.get('/api/categories'),
        vehicleApi.get('/api/vehicles')
      ]);
      setCategories(catRes.data);
      setVehicles(vehRes.data);
    } catch (err: any) {
      setError('Falha ao carregar dados do catálogo. Verifique se o vehicle-service está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'RENTED': return 'bg-yellow-100 text-yellow-800';
      case 'MAINTENANCE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponível';
      case 'RENTED': return 'Alugado';
      case 'MAINTENANCE': return 'Manutenção';
      default: return 'Desativado';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Car className="text-primary-600" />
          Catálogo de Veículos
        </h1>
        <p className="text-slate-500 mt-1">Gerenciamento de frota e categorias da locadora.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary-600" size={40} />
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Tag size={20} className="text-primary-600" />
              Categorias Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 border border-slate-100 rounded-lg hover:border-primary-200 hover:bg-primary-50/30 transition-colors">
                  <h3 className="font-bold text-slate-800">{cat.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{cat.description}</p>
                  <p className="text-primary-700 font-semibold mt-3">
                    A partir de R$ {cat.dailyRate.toFixed(2)}/dia
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Frota de Veículos</h2>
            </div>
            {vehicles.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Nenhum veículo cadastrado ainda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Veículo</th>
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Placa</th>
                      <th className="px-6 py-4">Diária</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicles.map((veh) => (
                      <tr key={veh.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {veh.brand} {veh.model} ({veh.year})
                        </td>
                        <td className="px-6 py-4">{veh.categoryName}</td>
                        <td className="px-6 py-4 font-mono text-xs bg-slate-100 w-fit px-2 py-1 rounded">
                          {veh.plate}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          R$ {veh.dailyRate.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(veh.status)}`}>
                            {getStatusLabel(veh.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}