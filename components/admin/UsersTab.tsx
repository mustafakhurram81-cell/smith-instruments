import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../AuthProvider';
import {
    Loader2, Users, Shield, ShieldCheck, UserCog, RefreshCw,
    Mail, Calendar, AlertTriangle
} from 'lucide-react';
import { Button } from '../Shared';

interface UserWithRole {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    role: 'admin' | 'manager';
}

export const UsersTab: React.FC = () => {
    const { user: currentUser, userRole: currentUserRole } = useAuth();
    const [users, setUsers] = useState<UserWithRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch all user roles
            const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('user_id, role, created_at');

            if (rolesError) throw rolesError;

            // Map roles to user info (we only have access to user_roles table from client)
            const usersWithRoles: UserWithRole[] = (roles || []).map(role => ({
                id: role.user_id,
                email: 'Loading...', // We'll try to get this from auth if possible
                created_at: role.created_at,
                last_sign_in_at: null,
                role: role.role as 'admin' | 'manager'
            }));

            // Try to get user emails from auth.users via RPC or direct query
            // For now, we'll use a workaround - query products to see who edited them
            // Or just show the user IDs with roles

            setUsers(usersWithRoles);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Failed to load users');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (userId: string, newRole: 'admin' | 'manager') => {
        if (currentUserRole !== 'admin') {
            alert('Only admins can change user roles');
            return;
        }

        if (userId === currentUser?.id) {
            alert('You cannot change your own role');
            return;
        }

        setUpdating(userId);

        const { error } = await supabase
            .from('user_roles')
            .update({ role: newRole })
            .eq('user_id', userId);

        if (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role: ' + error.message);
        } else {
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
        }

        setUpdating(null);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        managers: users.filter(u => u.role === 'manager').length
    };

    if (currentUserRole !== 'admin') {
        return (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
                <h2 className="text-xl font-medium text-brand-charcoal mb-2">Admin Access Required</h2>
                <p className="text-stone-500">Only administrators can manage user roles.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-brand-charcoal">{stats.total}</div>
                            <div className="text-xs text-stone-500">Total Users</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <ShieldCheck size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-brand-charcoal">{stats.admins}</div>
                            <div className="text-xs text-stone-500">Admins</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-stone-100 rounded-lg">
                            <UserCog size={20} className="text-stone-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-brand-charcoal">{stats.managers}</div>
                            <div className="text-xs text-stone-500">Managers</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                <h2 className="font-medium text-brand-charcoal">User Roles Management</h2>
                <Button variant="outline" onClick={fetchUsers}>
                    <RefreshCw size={16} className="mr-1" /> Refresh
                </Button>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto text-brand-gold" size={32} />
                    </div>
                ) : error ? (
                    <div className="p-12 text-center text-red-500">
                        <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{error}</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-stone-500">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No users found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-stone-50 border-b">
                            <tr>
                                <th className="p-4 text-left font-medium text-stone-600">User ID</th>
                                <th className="p-4 text-left font-medium text-stone-600">Added</th>
                                <th className="p-4 text-left font-medium text-stone-600">Current Role</th>
                                <th className="p-4 text-right font-medium text-stone-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {users.map(user => {
                                const isCurrentUser = user.id === currentUser?.id;

                                return (
                                    <tr key={user.id} className={`hover:bg-stone-50 ${isCurrentUser ? 'bg-blue-50/30' : ''}`}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${user.role === 'admin' ? 'bg-amber-500' : 'bg-stone-400'
                                                    }`}>
                                                    {user.role === 'admin' ? <ShieldCheck size={16} /> : <UserCog size={16} />}
                                                </div>
                                                <div>
                                                    <div className="font-mono text-xs text-stone-500 truncate max-w-[200px]" title={user.id}>
                                                        {user.id.slice(0, 8)}...
                                                    </div>
                                                    {isCurrentUser && (
                                                        <span className="text-xs text-blue-500 font-medium">You</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-stone-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(user.created_at)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-stone-100 text-stone-600'
                                                }`}>
                                                {user.role === 'admin' ? 'Admin' : 'Manager'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {isCurrentUser ? (
                                                <span className="text-xs text-stone-400">Cannot edit own role</span>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    {user.role === 'manager' ? (
                                                        <button
                                                            onClick={() => updateRole(user.id, 'admin')}
                                                            disabled={updating === user.id}
                                                            className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            {updating === user.id ? (
                                                                <Loader2 size={12} className="animate-spin" />
                                                            ) : (
                                                                <ShieldCheck size={12} />
                                                            )}
                                                            Promote to Admin
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => updateRole(user.id, 'manager')}
                                                            disabled={updating === user.id}
                                                            className="px-3 py-1.5 bg-stone-500 text-white text-xs rounded-lg hover:bg-stone-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            {updating === user.id ? (
                                                                <Loader2 size={12} className="animate-spin" />
                                                            ) : (
                                                                <UserCog size={12} />
                                                            )}
                                                            Demote to Manager
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Shield size={18} />
                    Role Permissions
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="font-medium text-blue-700 mb-1">Admin</div>
                        <ul className="text-blue-600 space-y-1">
                            <li>• Full access to all features</li>
                            <li>• Can export/import data</li>
                            <li>• Can manage user roles</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-medium text-blue-700 mb-1">Manager</div>
                        <ul className="text-blue-600 space-y-1">
                            <li>• Full access to products & categories</li>
                            <li>• Can view and respond to quotes</li>
                            <li>• Cannot export/import data</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
