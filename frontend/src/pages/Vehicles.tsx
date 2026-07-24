import { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';
import { Car, AlertCircle, Loader2, Tag, Plus, Edit2, Trash2, X } from 'lucide-react';

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
  chassi: string;
  color: string;
  seats: number;
  airConditioning: boolean;
  automaticTransmission: boolean;
  imageUrl: string;
  status: string;
  dailyRate: number;
  categoryId: number;
  categoryName: string;
}

export function Vehicles() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    chassi: '',
    color: '',
    seats: 4,
    airConditioning: true,
    automaticTransmission: false,
    imageUrl: '',
    status: 'AVAILABLE',
    dailyRate: 0,
    categoryId: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [catRes, vehRes] = await Promise.all([
        vehicleService.getAllCategories(),
        vehicleService.getAllVehicles()
      ]);
      setCategories(catRes.data);
      setVehicles(vehRes.data);
    } catch (err: any) {
      setError('Falha ao carregar dados do catálogo. Verifique se o vehicle-service está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? Number(value) : value
    }));
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear().toString(),
      plate: '',
      chassi: '',
      color: '',
      seats: 4,
      airConditioning: true,
      automaticTransmission: false,
      imageUrl: '',
      status: 'AVAILABLE',
      dailyRate: 0,
      categoryId: categories[0]?.id || 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      chassi: vehicle.chassi,
      color: vehicle.color,
      seats: vehicle.seats,
      airConditioning: vehicle.airConditioning,
      automaticTransmission: vehicle.automaticTransmission,
      imageUrl: vehicle.imageUrl || '',
      status: vehicle.status,
      dailyRate: vehicle.dailyRate,
      categoryId: vehicle.categoryId
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle.id, formData);
        setSuccess('Veículo atualizado com sucesso!');
      } else {
        await vehicleService.createVehicle(formData);
        setSuccess('Veículo criado com sucesso!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || `Erro ao ${editingVehicle ? 'atualizar' : 'criar'} veículo.`;
      setError(msg);
    }
  };

  const handleDelete = async (id: number, plate: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o veículo de placa ${plate}?`)) {
      return;
    }

    try {
      await vehicleService.deleteVehicle(id);
      setSuccess('Veículo excluído com sucesso!');
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao excluir veículo.';
      setError(msg);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Car className="text-primary-600" />
            Catálogo de Veículos
          </h1>
          <p className="text-slate-500 mt-1">Gerenciamento de frota e categorias da locadora.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary w-auto flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Veículo
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <AlertCircle size={20} />
          <span>{success}</span>
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
                      <th className="px-6 py-4 text-right">Ações</th>
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
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(veh)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                              title="Editar veículo"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(veh.id, veh.plate)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                              title="Excluir veículo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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

      {/* Modal de Criação/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="bg-primary-900 p-4 text-white flex justify-between items-center rounded-t-2xl">
              <h2 className="text-lg font-semibold">
                {editingVehicle ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary-200 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                    placeholder="Ex: Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                  <input
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                    placeholder="Ex: Corolla"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ano</label>
                  <input
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                    placeholder="Ex: 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Placa</label>
                  <input
                    name="plate"
                    value={formData.plate}
                    onChange={handleInputChange}
                    required
                    className="input-corporate uppercase"
                    placeholder="Ex: ABC1234"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chassi</label>
                <input
                  name="chassi"
                  value={formData.chassi}
                  onChange={handleInputChange}
                  required
                  className="input-corporate uppercase"
                  placeholder="17 caracteres"
                  maxLength={17}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cor</label>
                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                    placeholder="Ex: Prata"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Diária (R$)</label>
                  <input
                    name="dailyRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.dailyRate}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                  >
                    <option value="AVAILABLE">Disponível</option>
                    <option value="RENTED">Alugado</option>
                    <option value="MAINTENANCE">Manutenção</option>
                    <option value="DISABLED">Desativado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número de Assentos</label>
                  <input
                    name="seats"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.seats}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem</label>
                  <input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="input-corporate"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="airConditioning"
                    checked={formData.airConditioning}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Ar Condicionado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="automaticTransmission"
                    checked={formData.automaticTransmission}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Câmbio Automático</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingVehicle ? 'Salvar Alterações' : 'Cadastrar Veículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}