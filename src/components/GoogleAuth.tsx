import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GoogleAuthProps {
  onLogin: (userData: { name: string; email: string; picture: string }) => void;
}

export default function GoogleAuth({ onLogin }: GoogleAuthProps) {
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    }
  }, [user, onLogin]);

  const handleGoogleLogin = () => {
    const mockUser = {
      name: 'Игрок ' + Math.floor(Math.random() * 9999),
      email: 'player@simulator.com',
      picture: 'https://cdn.poehali.dev/files/1000595009.jpg'
    };
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.reload();
  };

  if (user) {
    return (
      <Card className="px-4 py-2 bg-slate-800/50 border-slate-700 flex items-center gap-3">
        <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
        <span className="font-semibold text-white">{user.name}</span>
        <Button 
          onClick={handleLogout} 
          variant="ghost" 
          size="sm"
          className="text-red-400 hover:text-red-300"
        >
          <Icon name="LogOut" size={16} />
        </Button>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      className="bg-white hover:bg-gray-100 text-slate-900 font-semibold"
    >
      <Icon name="User" size={20} className="mr-2" />
      Войти через Google
    </Button>
  );
}
