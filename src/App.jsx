import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  GraduationCap, Award, ShieldCheck, Share2, 
  Search, BookOpen, Building2, UserCircle, Loader2, Check
} from 'lucide-react';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  {"inputs":[{"internalType":"address","name":"_student","type":"address"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_subject","type":"string"},{"internalType":"string","name":"_grade","type":"string"}],"name":"issueDiploma","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getCertificate","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"studentName","type":"string"},{"internalType":"string","name":"subject","type":"string"},{"internalType":"string","name":"grade","type":"string"},{"internalType":"address","name":"studentAddress","type":"address"},{"internalType":"address","name":"issuer","type":"address"},{"internalType":"uint256","name":"issueDate","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct EduVerify.Certificate","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_accessor","type":"address"}],"name":"grantAccess","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

function App() {
  const { isConnected } = useAccount();
  const [role, setRole] = useState('student'); // 'student' or 'university'
  const [certId, setCertId] = useState("");

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Edu<span>Verify</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setRole('student')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                <UserCircle size={16} /> Talaba
              </button>
              <button 
                onClick={() => setRole('university')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'university' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                <Building2 size={16} /> Universitet
              </button>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {role === 'student' ? "Mening Diplomlarim" : "Diplom Berish Paneli"}
                  </h2>
                  <p className="text-slate-500 mt-1">Blokcheyn orqali tasdiqlangan ta'lim ma'lumotlari.</p>
                </div>
                {role === 'student' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all">
                    <Share2 size={16} /> CV bilan bog'lash
                  </button>
                )}
              </div>

              {!isConnected ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <BookOpen className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-medium text-lg">Hamyonni ulab, diplomlaringizni boshqaring.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {role === 'student' ? (
                    /* Student Certificate List */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group p-6 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
                        <Award className="text-indigo-600 mb-4" size={32} />
                        <h3 className="text-lg font-bold mb-1">Dasturiy Ta'minot Muhandisligi</h3>
                        <p className="text-slate-500 text-sm mb-4">TATU universiteti • 2024</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-white shadow-sm px-3 py-1.5 rounded-full w-fit">
                          <Check size={14} /> Tasdiqlangan
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* University Issue Form */
                    <div className="space-y-4 max-w-xl">
                      <div className="space-y-4">
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all" placeholder="Talaba hamyon manzili (0x...)" />
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all" placeholder="Talaba F.I.Sh" />
                        <div className="grid grid-cols-2 gap-4">
                          <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all" placeholder="Yo'nalish / Kurs" />
                          <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all" placeholder="Baho / Natija" />
                        </div>
                        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.01] transition-all">
                          Diplomni Blokcheynga Yuklash
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Verification Card */}
            <section className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck size={24} /> Diplomni Tekshirish
                </h3>
                <p className="text-indigo-100 text-sm mb-6">Diplom ID raqamini kiriting va uning haqiqiyligini real vaqtda tekshiring.</p>
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    className="w-full p-4 pl-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-indigo-200 outline-none"
                    placeholder="ID: 10234..."
                  />
                  <Search className="absolute left-4 top-4 text-indigo-200" size={20} />
                </div>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-lg hover:bg-slate-50 transition-all">
                  Tekshirib ko'rish
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            {/* Access Management */}
            {role === 'student' && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-2">Ish beruvchiga ruxsat</h3>
                <p className="text-slate-500 text-sm mb-6">Ish beruvchining manzilini kiriting va u sizning diplomlaringizni ko'ra oladi.</p>
                <div className="space-y-4">
                  <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Ish beruvchi manzili" />
                  <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">
                    Ruxsat Berish
                  </button>
                </div>
              </section>
            )}
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>&copy; 2024 EduVerify Ecosystem. Unified Education Verification for Web3.</p>
      </footer>
    </div>
  );
}

export default App;
