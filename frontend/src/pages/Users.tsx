import { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Loader2, AlertCircle, CheckCircle, Users as UsersIcon, Trash2, Edit2 } from 'lucide-react';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    roles: [] as string[],
    enabled: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (err: any) {
      setError('Falha ao carregar usuários. Verifique suas permissões.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      roles: [],
      enabled: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      roles: user.roles,
      enabled: user.enabled
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Atualizar usuário existente
        await api.put(`/api/users/${editingUser.id}`, {
          name: formData.name,
          email: formData.email,
          roles: formData.roles,
          enabled: formData.enabled
        });
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        await api.post('/api/users', formData);
        setSuccess('Usuário criado com sucesso!');
      }

      setIsModalOpen(false);
      setFormData({ username: '', name: '', email: '', password: '', roles: [], enabled: true });
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || `Erro ao ${editingUser ? 'atualizar' : 'criar'} usuário. Verifique os dados.`;
      setError(msg);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${username}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await api.delete(`/api/users/${id}`);
      setSuccess('Usuário excluído com sucesso!');
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao excluir usuário.';
      setError(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UsersIcon className="text-primary-600" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-slate-500 mt-1">Visualize, cadastre e gerencie permissões dos usuários.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary w-auto flex items-center gap-2"
        >
          <UserPlus size={20} />
          Novo Usuário
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="animate-spin mx-auto mb-3 text-primary-600" size={32} />
            Carregando usuários...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Permissões</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(role => (
                          <span key={role} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-md border border-primary-100">
                            {role.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.enabled ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                          title="Editar usuário"
                        >
                          <Edit2 size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                          title="Excluir usuário"
                        >
                          <Trash2 size={16} />
                          Excluir
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

      {/* Modal de Criação/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-primary-900 p-4 text-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary-200 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="input-corporate"
                    placeholder="Ex: joao.silva"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-corporate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-corporate"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                    className="input-corporate"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Permissões</label>
                <div className="flex gap-4">
                  {['ROLE_ADMIN', 'ROLE_CAIXA'].map(role => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.roles.includes(role)}
                        onChange={() => handleRoleChange(role)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700">{role.replace('ROLE_', '')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {editingUser && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="enabled"
                        checked={formData.enabled === true}
                        onChange={() => setFormData({...formData, enabled: true})}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-slate-700">Ativo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="enabled"
                        checked={formData.enabled === false}
                        onChange={() => setFormData({...formData, enabled: false})}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-slate-700">Inativo</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}