import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { parseUnits } from 'viem';
import { Rocket, Shield, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// NAMUNAVIY KONTRAKT (Sepolia testnet uchun)
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const CONTRACT_ABI = [
  { "inputs": [{"internalType": "uint256","name": "x","type": "uint256"}],"name": "set","outputs": [],"stateMutability": "nonpayable","type": "function" },
  { "inputs": [],"name": "get","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function" }
];

function App() {
  const { isConnected, address } = useAccount();
  const [newValue, setNewValue] = useState("");
  
  // Ma'lumot o'qish
  const { data: storedValue, refetch: refetchValue } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'get',
  });

  // Ma'lumot yozish
  const { writeContract, data: hash, error: writeError, isPending: isSigning } = useWriteContract();

  // Tranzaksiya holatini kutish
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSend = () => {
    if (!newValue) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'set',
      args: [BigInt(newValue)],
    });
  };

  return (
    <div className="min-h-screen bg-mesh p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
            <Rocket className="text-indigo-500" /> Web3<span>Pro</span>
          </h1>
          <ConnectButton />
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Section */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="text-indigo-400" /> Kontrakt Holati
            </h2>
            <div className="bg-black/20 p-6 rounded-2xl text-center">
              <p className="text-secondary text-sm mb-2 font-medium">Saqlangan Qiymat</p>
              <span className="text-5xl font-bold text-white">
                {storedValue?.toString() || "0"}
              </span>
            </div>
            <button 
              onClick={() => refetchValue()}
              className="mt-6 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-semibold"
            >
              Ma'lumotni Yangilash
            </button>
          </div>

          {/* Action Section */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Info className="text-indigo-400" /> Tranzaksiya Yuborish
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-secondary mb-2 ml-1">Yangi qiymat</label>
                <input 
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Raqam kiriting..."
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <button 
                onClick={handleSend}
                disabled={!isConnected || isSigning || isConfirming}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isSigning ? "Imzolanmoqda..." : isConfirming ? "Tasdiqlanmoqda..." : "Kontraktga Yozish"}
              </button>
            </div>

            {/* Status Feedback UI */}
            <div className="mt-8 space-y-3">
              {isConfirming && (
                <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm font-medium">Tranzaksiya blokcheynda tasdiqlanishi kutilmoqda...</span>
                </div>
              )}
              {isConfirmed && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 animate-in fade-in zoom-in duration-300">
                  <CheckCircle size={20} />
                  <span className="text-sm font-medium">Tranzaksiya muvaffaqiyatli yakunlandi!</span>
                </div>
              )}
              {writeError && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                  <AlertCircle size={20} />
                  <span className="text-sm font-medium">Xatolik: {writeError.shortMessage || "Noma'lum xato"}</span>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="mt-16 text-center text-sm text-secondary opacity-50">
          <p>&copy; 2024 Advanced DApp Ecosystem. Sepolia Testnet</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
