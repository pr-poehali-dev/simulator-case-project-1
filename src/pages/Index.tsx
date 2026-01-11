import { useState } from 'react';
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
  { id: '1', name: 'Керамбит голд', rarity: 'legendary', collection: 'Золотая коллекция' },
  { id: '2', name: 'Тычки Аркана', rarity: 'red', collection: 'Красная коллекция' },
  { id: '3', name: 'Бабочка нож Аркана', rarity: 'red', collection: 'Красная коллекция' },
  { id: '4', name: 'Jikomanda нож Аркана', rarity: 'red', collection: 'Красная коллекция' },
  { id: '5', name: 'Babka GeY нож', rarity: 'blue', collection: 'Синяя Коллекция' },
  { id: '6', name: 'Ничего', rarity: 'common', collection: 'Обычная' },
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
    '1': 1,
    '2': 4,
    '3': 5,
    '4': 7,
    '5': 19,
    '6': 64,
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
  const [currentView, setCurrentView] = useState<'home' | 'inventory' | 'shop'>('home');
  const [silver, setSilver] = useState(5000);
  const [gold, setGold] = useState(1000);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<Item | null>(null);

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
      if (item.id !== '6') {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SIMULATOR CASE 2026
            </div>
          </div>
          
          <div className="flex gap-4">
            <Card className="px-4 py-2 bg-slate-800/50 border-slate-700 flex items-center gap-2">
              <Icon name="Coins" className="text-gray-400" size={20} />
              <span className="font-semibold text-gray-300">{silver.toLocaleString()}</span>
            </Card>
            <Card className="px-4 py-2 bg-slate-800/50 border-slate-700 flex items-center gap-2">
              <Icon name="Crown" className="text-yellow-500" size={20} />
              <span className="font-semibold text-yellow-400">{gold.toLocaleString()}</span>
            </Card>
          </div>
        </header>

        {currentView === 'home' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            <div className="text-center py-12">
              <img 
                src="https://cdn.poehali.dev/files/1000595009.jpg" 
                alt="Case Logo" 
                className="w-64 h-64 mx-auto rounded-full shadow-2xl shadow-cyan-500/50 animate-glow"
              />
              <h2 className="text-3xl font-bold mt-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Открывай кейсы и собирай легендарные ножи!
              </h2>
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
      </div>
    </div>
  );
}
