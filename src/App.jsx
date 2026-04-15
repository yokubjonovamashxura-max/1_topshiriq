import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  User, Stethoscope, ShieldCheck, ClipboardList, 
  Search, PlusCircle, UserPlus, History, Activity
} from 'lucide-react';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  {"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_age","type":"uint256"}],"name":"registerPatient","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_doctor","type":"address"}],"name":"grantAccess","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_patient","type":"address"},{"internalType":"string","name":"_diagnosis","type":"string"},{"internalType":"string","name":"_treatment","type":"string"}],"name":"addMedicalRecord","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_patient","type":"address"}],"name":"getMedicalRecords","outputs":[{"components":[{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"treatment","type":"string"},{"internalType":"address","name":"doctor","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct MedicalSystem.Record[]","name":"","type":"tuple[]"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"string","name":"_serialNumber","type":"string"}],"name":"verifyMedicine","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}
];

function App() {
  const { address, isConnected } = useAccount();
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [medCode, setMedCode] = useState("");
  const [isVerified, setIsVerified] = useState(null);

  // Wagmi Hooks
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });

  const handleVerify = () => {
    // Soddalashtirilgan logika (haqiqiy muloqot backend orqali bo'ladi)
    setIsVerified(medCode.length > 5);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Med<span>Block</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setRole('patient')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${role === 'patient' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <User size={16} /> Bemor
              </button>
              <button 
                onClick={() => setRole('doctor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${role === 'doctor' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Stethoscope size={16} /> Shifokor
              </button>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Dashboard Area */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-2xl border border-slate-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                {role === 'patient' ? <ClipboardList className="text-blue-500" /> : <UserPlus className="text-blue-500" />}
                {role === 'patient' ? "Mening Tibbiy Kartam" : "Bemorga Ma'lumot Qo'shish"}
              </h2>
              
              {!isConnected ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-500">Iltimos, avval hamyonni ulang.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {role === 'patient' ? (
                    <div className="space-y-4">
                      {/* Patient Logic: View Records */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-800">Tashxis: Gripp</span>
                          <span className="text-xs text-slate-400">2024-05-15</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">Davolash: Paratsetamol va to'liq dam olish.</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-800">Tashxis: Vitamin yetishmasligi</span>
                          <span className="text-xs text-slate-400">2024-04-10</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">Davolash: Vitamin D kursini boshlash.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Doctor Logic: Add Record Form */}
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Bemor hamyon manzili (0x...)" />
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Tashxis" />
                      <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Davolash muolajasi"></textarea>
                      <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                        Blokcheynga Saqlash
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Audit Logs / Activity History */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <History className="text-blue-500" /> Kirish Tarixi (Audit Log)
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 text-sm text-slate-500 border-b border-slate-50">
                  <span>Dr. Smith ma'lumotni o'qidi</span>
                  <span>14:05</span>
                </div>
                <div className="flex justify-between items-center p-3 text-sm text-slate-500 border-b border-slate-50">
                  <span>Siz Dr. Jonesga ruxsat berdingiz</span>
                  <span>Kecha, 09:20</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area: Medicine & Permissions */}
          <div className="space-y-8">
            {/* Medicine Verifier */}
            <section className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldCheck /> Dori Haqiqiyligi
              </h3>
              <p className="text-blue-100 text-sm mb-6">Dorining seriya raqamini kiriting va uning haqiqiyligini tekshiring.</p>
              <div className="relative">
                <input 
                  type="text" 
                  value={medCode}
                  onChange={(e) => setMedCode(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-blue-200"
                  placeholder="Seriya raqami..."
                />
                <Search className="absolute left-4 top-4 text-blue-200" size={20} />
              </div>
              <button 
                onClick={handleVerify}
                className="mt-4 w-full py-3 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all"
              >
                Tekshirish
              </button>

              {isVerified !== null && (
                <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 ${isVerified ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'}`}>
                  {isVerified ? <ShieldCheck /> : <AlertCircle />}
                  <span>{isVerified ? "Dori haqiqiy (Verified)" : "Dori topilmadi yoki soxta!"}</span>
                </div>
              )}
            </section>

            {/* Access Management */}
            {role === 'patient' && (
              <section className="bg-white p-8 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold mb-4">Ruxsat Berish</h3>
                <p className="text-slate-500 text-sm mb-4">Istalgan shifokor manzilini kiriting va unga kirish huquqini bering.</p>
                <div className="space-y-3">
                  <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Shifokor manzili (0x...)" />
                  <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium text-sm hover:opacity-90">
                    Ruxsat Berish
                  </button>
                </div>
              </section>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
