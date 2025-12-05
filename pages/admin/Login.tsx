import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side auth for MVP
        // In production, use Supabase Auth or proper backend verification
        if (password === 'smith123') {
            localStorage.setItem('admin_authenticated', 'true');
            navigate('/admin');
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-brand-charcoal rounded-full text-brand-gold">
                        <Lock size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-serif text-center text-brand-charcoal mb-2">Admin Access</h1>
                <p className="text-center text-stone-500 mb-8">Please enter the password to continue.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false); }}
                            placeholder="Password"
                            className={`w-full p-4 rounded-lg bg-stone-50 border ${error ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-brand-gold'} outline-none transition-colors`}
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mt-2 ml-1">Incorrect password</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-brand-charcoal text-white font-medium rounded-lg hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};
