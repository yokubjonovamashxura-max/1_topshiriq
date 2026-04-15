import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  Package, Truck, MapPin, History, 
  Search, Plus, UserPlus, CheckCircle, ArrowRightLeft, Globe
} from 'lucide-react';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  {"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"string","name":"_location","type":"string"}],"name":"addProduct","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"},{"internalType":"uint8","name":"_status","type":"uint8"},{"internalType":"string","name":"_location","type":"string"}],"name":"updateStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"},{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"}],"name":"getProduct","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"currentOwner","type":"address"},{"internalType":"uint8","name":"status","type":"uint8"},{"components":[{"internalType":"string","name":"location","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"address","name":"handledBy","type":"address"}],"internalType":"struct LogisticsSystem.TrackingPoint[]","name":"history","type":"tuple[]"}],"stateMutability":"view","type":"function"}
];

const STATUS_MAP = ["Ishlab chiqarildi", "Yo'lda (In Transit)", "Yetkazildi", "Bekor qilindi"];

function App() {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState('track'); // 'add', 'track', 'manage'
  const [searchId, setSearchId] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-100">
              <Package className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Supply<span>Chain</span></h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setTab('track')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'track' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
              >
                <Search size={16} /> Kuzatish
              </button>
              <button 
                onClick={() => setTab('add')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'add' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
              >
                <Plus size={16} /> Qo'shish
              </button>
              <button 
                onClick={() => setTab('manage')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'manage' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
              >
                <ArrowRightLeft size={16} /> Boshqarish
              </button>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Dashboard */}
          <div className="lg:col-span-8 space-y-8">
            
            {tab === 'track' && (
              <section className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                  <h2 className="text-3xl font-bold mb-4">Mahsulotni Kuzatish</h2>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">Mahsulot ID raqamini kiriting va uning butun ta'minot zanjiri tarixini ko'ring.</p>
                  <div className="flex gap-2 max-w-lg mx-auto">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 transition-all font-medium"
                        placeholder="Mahsulot ID (masalan: 1)"
                      />
                      <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                    </div>
                    <button className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all">
                      Qidirish
                    </button>
                  </div>
                </div>

                {/* Tracking Results (Dummy UI) */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <History className="text-orange-500" /> Harakatlar Tarixi (Audit)
                  </h3>
                  <div className="space-y-8 relative">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                    
                    {[
                      { l: "Toshkent Porti", s: "Yo'lda", d: "15:30, Bugun", a: true },
                      { l: "Samarqand Terminali", s: "Jarayonda", d: "Kecha, 09:00", a: false },
                      { l: "Fergona Fabrikasi", s: "Ishlab chiqarildi", d: "14-May, 12:45", a: false }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-6 relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${step.a ? 'bg-orange-500 text-white ring-4 ring-orange-50' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                          {step.a ? <MapPin size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{step.l}</h4>
                          <p className="text-sm text-slate-500">{step.s} • {step.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {tab === 'add' && (
              <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-2">Yangi Mahsulot Kiritish</h2>
                <p className="text-slate-500 mb-8">Ishlab chiqaruvchi sifatida yangi mahsulotni blokcheynga qo'shing.</p>
                <div className="space-y-6 max-w-xl">
                  <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="Mahsulot nomi" />
                  <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="Mahsulot tavsifi"></textarea>
                  <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="Hozirgi joylashuv (Shahar)" />
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
                    Blokcheynga Joylash
                  </button>
                </div>
              </section>
            )}

            {tab === 'manage' && (
              <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-2">Boshqaruv va Egalik</h2>
                <p className="text-slate-500 mb-8">Statusni yangilang yoki mahsulotni keyingi egasiga o'tkazing.</p>
                <div className="space-y-8">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="bg-white p-3 rounded-2xl shadow-sm"><Package className="text-orange-500" /></div>
                      <div>
                        <h4 className="font-bold">iPhone 15 Pro</h4>
                        <p className="text-xs text-slate-400">ID: #102938</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
                        <Truck size={16} /> Statusni yangilash
                      </button>
                      <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all">
                        <ArrowRightLeft size={16} /> Egasi o'zgartirish
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar - Info & Stats */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Globe size={24} className="text-orange-400" /> Global Monitoring
                </h3>
                <p className="text-slate-400 text-sm mb-8">Blokcheyn orqali barcha yuklar shaffof va o'zgartirib bo'lmas holda saqlanmoqda.</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 text-sm">
                    <span>Jami mahsulotlar</span>
                    <span className="font-bold">1,240</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 text-sm">
                    <span>Yo'ldagi yuklar</span>
                    <span className="font-bold">45</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
              <h3 className="font-bold mb-4">Haqiqiylik Sertifikati</h3>
              <p className="text-sm text-slate-500 mb-6">Har bir mahsulot blokcheyn orqali validatsiyadan o'tgan signature-ga ega.</p>
              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100">
                <CheckCircle size={20} /> Blockchain Verified
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
