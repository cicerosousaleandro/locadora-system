import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/api';
import {
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  status: string;
  dailyRate: number;
  categoryName: string;
}

interface Category {
  id: number;
  name: string;
  dailyRate: number;
  vehicleCount: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [vehRes, catRes] = await Promise.all([
        vehicleService.getAllVehicles(),
        vehicleService.getAllCategories()
      ]);
      setVehicles(vehRes.data);
      setCategories(catRes.data);
    } catch (err: any) {
      setError('Falha ao carregar dados do dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular estatísticas
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const rentedVehicles = vehicles.filter(v => v.status === 'RENTED').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'MAINTENANCE').length;

  const totalRevenue = vehicles
    .filter(v => v.status === 'AVAILABLE')
    .reduce((sum, v) => sum + v.dailyRate, 0);

  const avgDailyRate = totalVehicles > 0
    ? vehicles.reduce((sum, v) => sum + v.dailyRate, 0) / totalVehicles
    : 0;

  // Dados para gráfico de pizza (Status dos Veículos)
  const statusData = [
    { name: 'Disponíveis', value: availableVehicles, color: '#10b981' },
    { name: 'Alugados', value: rentedVehicles, color: '#f59e0b' },
    { name: 'Manutenção', value: maintenanceVehicles, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Dados para gráfico de barras (Veículos por Categoria)
  const categoryData = categories.map(cat => ({
    name: cat.name,
    veículos: cat.vehicleCount,
    'Diária Média': cat.dailyRate
  }));

  // Cores para o gráfico de pizza
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Visão geral do sistema de locadora.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total de Veículos</p>
              <p className="text-3xl font-bold text-slate-800">{totalVehicles}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Car className="text-primary-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-600">
            <TrendingUp size={16} className="mr-1 text-green-600" />
            <span>{categories.length} categorias</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Disponíveis</p>
              <p className="text-3xl font-bold text-green-600">{availableVehicles}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            Prontos para locação
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Alugados</p>
              <p className="text-3xl font-bold text-yellow-600">{rentedVehicles}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Package className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            Em uso por clientes
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Receita Potencial/Dia</p>
              <p className="text-3xl font-bold text-primary-600">
                R$ {totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <DollarSign className="text-primary-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            Se todos disponíveis forem alugados
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Status dos Veículos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Status da Frota</h2>
          {statusData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <AlertCircle size={40} className="mb-2" />
              <p>Sem veículos cadastrados</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Gráfico de Barras - Veículos por Categoria */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Veículos por Categoria</h2>
          {categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <AlertCircle size={40} className="mb-2" />
              <p>Sem categorias cadastradas</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="veículos" fill="#0ea5e9" />
                <Bar dataKey="Diária Média" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Resumo do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Diária Média</p>
            <p className="text-2xl font-bold text-slate-800">
              R$ {avgDailyRate.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Taxa de Ocupação</p>
            <p className="text-2xl font-bold text-slate-800">
              {totalVehicles > 0 ? ((rentedVehicles / totalVehicles) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Veículos em Manutenção</p>
            <p className="text-2xl font-bold text-slate-800">
              {maintenanceVehicles}
            </p>
          </div>
        </div>
      </div>

      {/* Últimas Atividades (Placeholder) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Últimas Atividades</h2>
        <div className="text-center text-slate-500 py-8">
          <Users size={40} className="mx-auto mb-2 opacity-50" />
          <p>Histórico de atividades será implementado em breve</p>
        </div>
      </div>
    </div>
  );
}