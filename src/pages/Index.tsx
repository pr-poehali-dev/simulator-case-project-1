import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Rarity = 'legendary' | 'red' | 'blue' | 'common';

interface Item {
  id: string;
  name: string;
  rarity: Rarity;
  collection: string;
}

interface CaseType {
  id: string;
  name: string;
  price: number;
  currency: 'gold';
  items: Item[];
}

const ITEMS: Item[] = [
  { id: '1', name: 'Керамбит | Gradient', rarity: 'legendary', collection: 'Золотая коллекция' },
  { id: '2', name: 'Karambit | Fade', rarity: 'legendary', collection: 'Золотая коллекция' },
  { id: '3', name: 'Butterfly | Doppler', rarity: 'red', collection: 'Красная коллекция' },
  { id: '4', name: 'Karambit | Tiger Tooth', rarity: 'red', collection: 'Красная коллекция' },
  { id: '5', name: 'M9 Bayonet | Crimson Web', rarity: 'red', collection: 'Красная коллекция' },
  { id: '6', name: 'Flip Knife | Slaughter', rarity: 'red', collection: 'Красная коллекция' },
  { id: '7', name: 'Huntsman | Night', rarity: 'blue', collection: 'Синяя Коллекция' },
  { id: '8', name: 'Bowie | Damascus Steel', rarity: 'blue', collection: 'Синяя Коллекция' },
  { id: '9', name: 'Gut Knife | Rust Coat', rarity: 'blue', collection: 'Синяя Коллекция' },
  { id: '10', name: 'Ничего', rarity: 'common', collection: 'Обычная' },
];

const CASES: CaseType[] = [
  {
    id: 'sharp',
    name: 'Sharp Case',
    price: 100,
    currency: 'gold',
    items: ITEMS.filter(i => i.rarity === 'red' || i.rarity === 'common'),
  },
  {
    id: 'knife',
    name: 'Knife Case',
    price: 500,
    currency: 'gold',
    items: ITEMS,
  },
];

const getRarityColor = (rarity: Rarity) => {
  switch (rarity) {
    case 'legendary': return 'from-yellow-500 to-orange-500';
    case 'red': return 'from-red-500 to-pink-500';
    case 'blue': return 'from-blue-500 to-cyan-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getRarityChance = (item: Item): number => {
  const chances: Record<string, number> = {
    '1': 0.5,
    '2': 0.5,
    '3': 2,
    '4': 2,
    '5': 3,
    '6': 3,
    '7': 10,
    '8': 9,
    '9': 10,
    '10': 60,
  };
  return chances[item.id] || 0;
};

const openCase = (caseItems: Item[]): Item => {
  const random = Math.random() * 100;
  let accumulated = 0;
  
  for (const item of caseItems) {
    accumulated += getRarityChance(item);
    if (random <= accumulated) {
      return item;
    }
  }
  
  return caseItems[caseItems.length - 1];
};

export default function Index() {
  const [currentView, setCurrentView] = useState<'home' | 'inventory' | 'shop' | 'battle'>('home');
  const [silver, setSilver] = useState(() => {
    const saved = localStorage.getItem('silver');
    return saved ? parseInt(saved) : 5000;
  });
  const [gold, setGold] = useState(() => {
    const saved = localStorage.getItem('gold');
    return saved ? parseInt(saved) : 1000;
  });
  const [inventory, setInventory] = useState<Item[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<Item | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);

  useEffect(() => {
    localStorage.setItem('silver', silver.toString());
  }, [silver]);

  useEffect(() => {
    localStorage.setItem('gold', gold.toString());
  }, [gold]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleOpenCase = (caseType: CaseType) => {
    if (gold < caseType.price) {
      toast.error('Недостаточно золота!');
      return;
    }

    setGold(prev => prev - caseType.price);
    setIsOpening(true);
    setWonItem(null);

    setTimeout(() => {
      const item = openCase(caseType.items);
      setWonItem(item);
      if (item.id !== '10') {
        setInventory(prev => [...prev, item]);
      }
      setIsOpening(false);
      
      if (item.rarity === 'legendary') {
        toast.success(`🎉 ЛЕГЕНДАРНЫЙ ДРОП! ${item.name}!`);
      } else if (item.rarity === 'red') {
        toast.success(`🔥 Выпало: ${item.name}!`);
      } else if (item.rarity === 'blue') {
        toast.info(`Выпало: ${item.name}`);
      }
    }, 3000);
  };

  const handleClick = () => {
    const randomSilver = Math.floor(Math.random() * 1800) + 200;
    const randomGold = Math.floor(Math.random() * 50) + 10;
    setSilver(prev => prev + randomSilver);
    setGold(prev => prev + randomGold);
    toast.success(`+${randomSilver} серебра, +${randomGold} золота`);
  };

  const handleBattle = () => {
    setIsBattling(true);
    setBattleResult(null);

    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      setBattleResult(isWin ? 'win' : 'lose');
      setIsBattling(false);

      if (isWin) {
        const silverReward = Math.floor(Math.random() * 1000) + 500;
        const goldReward = 400;
        setSilver(prev => prev + silverReward);
        setGold(prev => prev + goldReward);
        toast.success(`🏆 Победа! +${silverReward} серебра, +${goldReward} золота`);
      } else {
        const silverReward = Math.floor(Math.random() * 300) + 100;
        setSilver(prev => prev + silverReward);
        toast.error(`💀 Поражение! +${silverReward} серебра`);
      }
    }, 4000);
  };

  return (
    <div 
      className="min-h-screen text-white relative"
      style={{
        backgroundImage: 'url(https://cdn.poehali.dev/projects/fa499df3-3a0e-4bd9-aba8-d93c648f57ef/files/cbc2bc48-8366-4cb3-beb8-44c6439d1e20.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SIMULATOR CASE 2026
            </div>
          </div>
          
          <div className="flex gap-4">
            <Card className="px-4 py-2 bg-slate-800/50 border-slate-700 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center font-bold text-white">С</div>
              <span className="font-semibold text-gray-300">{silver.toLocaleString()}</span>
            </Card>
            <Card className="px-4 py-2 bg-slate-800/50 border-slate-700 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-slate-900">Г</div>
              <span className="font-semibold text-yellow-400">{gold.toLocaleString()}</span>
            </Card>
          </div>
        </header>

        {currentView === 'home' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                onClick={() => setCurrentView('inventory')}
                size="lg"
                className="h-24 text-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                <Icon name="Package" size={32} className="mr-3" />
                Инвентарь
              </Button>
              <Button
                onClick={() => setCurrentView('shop')}
                size="lg"
                className="h-24 text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              >
                <Icon name="ShoppingBag" size={32} className="mr-3" />
                Магазин
              </Button>
              <Button
                onClick={handleClick}
                size="lg"
                className="h-24 text-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 animate-float"
              >
                <Icon name="Sparkles" size={32} className="mr-3" />
                Кликер
              </Button>
              <Button
                onClick={() => setCurrentView('battle')}
                size="lg"
                className="h-24 text-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
              >
                <Icon name="Swords" size={32} className="mr-3" />
                Бой
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 py-12">
              <div className="text-center">
                <img 
                  src="https://cdn.poehali.dev/files/1000595009.jpg" 
                  alt="Case Logo" 
                  className="w-64 h-64 mx-auto rounded-full shadow-2xl shadow-cyan-500/50 animate-glow"
                />
                <h2 className="text-2xl font-bold mt-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Открывай кейсы!
                </h2>
              </div>
              <div className="text-center">
                <img 
                  src="https://cdn.poehali.dev/files/1000594973.jpg" 
                  alt="Battle Car" 
                  className="w-64 h-64 mx-auto rounded-lg shadow-2xl shadow-orange-500/50 animate-float object-cover"
                />
                <h2 className="text-2xl font-bold mt-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Сражайся и побеждай!
                </h2>
              </div>
            </div>
          </div>
        )}

        {currentView === 'shop' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Магазин кейсов</h2>
              <Button onClick={() => setCurrentView('home')} variant="outline">
                <Icon name="Home" className="mr-2" />
                Домой
              </Button>
            </div>

            {isOpening && (
              <Card className="p-8 bg-slate-800/50 border-slate-700">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold">Открываем кейс...</div>
                  <div className="overflow-hidden relative h-48 bg-slate-900 rounded-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-full bg-cyan-500 shadow-lg shadow-cyan-500/50"></div>
                    </div>
                    <div className="flex gap-4 p-4 animate-spin-case">
                      {[...Array(20)].map((_, i) => {
                        const item = CASES[0].items[i % CASES[0].items.length];
                        return (
                          <div
                            key={i}
                            className={`min-w-[150px] h-40 rounded-lg bg-gradient-to-br ${getRarityColor(item.rarity)} p-4 flex flex-col items-center justify-center shadow-xl`}
                          >
                            <Icon name="Sword" size={48} className="text-white" />
                            <span className="text-sm font-bold text-white mt-2">{item.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {wonItem && !isOpening && (
              <Card className="p-8 bg-slate-800/50 border-slate-700">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold">Вы получили:</div>
                  <div className={`w-64 h-64 mx-auto rounded-lg bg-gradient-to-br ${getRarityColor(wonItem.rarity)} p-6 flex flex-col items-center justify-center shadow-2xl animate-float`}>
                    <Icon name="Sword" size={96} className="text-white" />
                    <div className="text-2xl font-bold text-white mt-4">{wonItem.name}</div>
                    <div className="text-sm text-white/80">{wonItem.collection}</div>
                  </div>
                  <Button onClick={() => setWonItem(null)} size="lg" className="bg-cyan-600 hover:bg-cyan-500">
                    Продолжить
                  </Button>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CASES.map(caseType => (
                <Card key={caseType.id} className="p-6 bg-slate-800/50 border-slate-700 hover:border-cyan-500 transition-all">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{caseType.name}</h3>
                      <div className="flex items-center justify-center gap-2 text-yellow-400">
                        <Icon name="Crown" size={24} />
                        <span className="text-xl font-bold">{caseType.price}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {caseType.items.slice(0, 4).map(item => (
                        <div
                          key={item.id}
                          className={`h-24 rounded bg-gradient-to-br ${getRarityColor(item.rarity)} p-2 flex flex-col items-center justify-center`}
                        >
                          <Icon name="Sword" size={32} className="text-white" />
                          <span className="text-xs text-white text-center mt-1">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleOpenCase(caseType)}
                      disabled={isOpening || gold < caseType.price}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                      size="lg"
                    >
                      Открыть кейс
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Инвентарь</h2>
              <Button onClick={() => setCurrentView('home')} variant="outline">
                <Icon name="Home" className="mr-2" />
                Домой
              </Button>
            </div>

            {inventory.length === 0 ? (
              <Card className="p-12 bg-slate-800/50 border-slate-700 text-center">
                <Icon name="PackageOpen" size={64} className="mx-auto mb-4 text-slate-600" />
                <p className="text-xl text-slate-400">Инвентарь пуст. Откройте кейс в магазине!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {inventory.map((item, idx) => (
                  <Card
                    key={idx}
                    className={`p-4 bg-gradient-to-br ${getRarityColor(item.rarity)} border-0 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform`}
                  >
                    <Icon name="Sword" size={48} className="text-white" />
                    <div className="text-center">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="text-xs text-white/80">{item.collection}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'battle' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Арена боёв</h2>
              <Button onClick={() => setCurrentView('home')} variant="outline">
                <Icon name="Home" className="mr-2" />
                Домой
              </Button>
            </div>

            <Card className="p-8 bg-slate-800/90 border-slate-700">
              <div className="text-center space-y-6">
                <div className="relative">
                  <img 
                    src="https://cdn.poehali.dev/files/1000594973.jpg" 
                    alt="Battle Arena" 
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
                  />
                  {isBattling && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <div className="text-4xl font-bold animate-pulse">⚔️ БОЙ ИДЁТ ⚔️</div>
                    </div>
                  )}
                </div>

                {battleResult && !isBattling && (
                  <div className={`text-3xl font-bold py-6 px-8 rounded-lg ${
                    battleResult === 'win' 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                      : 'bg-gradient-to-r from-red-600 to-orange-600'
                  }`}>
                    {battleResult === 'win' ? '🏆 ПОБЕДА!' : '💀 ПОРАЖЕНИЕ'}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="text-xl font-semibold">
                    <p className="text-green-400">🏆 При победе: 500-1500 серебра + 400 золота</p>
                    <p className="text-red-400">💀 При поражении: 100-400 серебра</p>
                  </div>

                  <Button
                    onClick={handleBattle}
                    disabled={isBattling}
                    size="lg"
                    className="w-full max-w-md bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-2xl py-8"
                  >
                    {isBattling ? (
                      <>
                        <Icon name="Loader2" size={32} className="mr-3 animate-spin" />
                        Бой в процессе...
                      </>
                    ) : (
                      <>
                        <Icon name="Swords" size={32} className="mr-3" />
                        Начать бой
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}