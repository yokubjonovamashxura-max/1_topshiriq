import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ImagePlus, LayoutDashboard, Send, Gem, Loader2, CheckCircle, ExternalLink } from 'lucide-react';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  {"inputs":[{"internalType":"string","name":"nftName","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"imageURI","type":"string"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getNFTDetails","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"imageURI","type":"string"},{"internalType":"address","name":"creator","type":"address"}],"internalType":"struct MashxuraNFT.NFTMetadata","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}
];

function App() {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState('mint');
  const [nftData, setNftData] = useState({ name: '', desc: '', url: '' });

  const { writeContract, data: hash, isPending: isSigning } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleMint = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      args: [nftData.name, nftData.desc, nftData.url],
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <nav className="flex justify-between items-center mb-12 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
              <Gem size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              NFT<span>Studio</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-slate-800/50 p-1 rounded-xl">
              <button 
                onClick={() => setTab('mint')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'mint' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <ImagePlus size={16} /> Mint
              </button>
              <button 
                onClick={() => setTab('gallery')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'gallery' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutDashboard size={16} /> Gallery
              </button>
            </div>
            <ConnectButton />
          </div>
        </nav>

        <main>
          {tab === 'mint' ? (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-2">Yangi NFT Yarating</h2>
                <p className="text-slate-400 mb-8">Raqamli san'atingizni blokcheynga abadiy muhrlang.</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">NFT Nomi</label>
                      <input 
                        type="text" 
                        value={nftData.name}
                        onChange={(e) => setNftData({...nftData, name: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 transition-all"
                        placeholder="Masalan: Golden Lion"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Rasm URL (IPFS/HTTP)</label>
                      <input 
                        type="text" 
                        value={nftData.url}
                        onChange={(e) => setNftData({...nftData, url: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 transition-all"
                        placeholder="ipfs://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Tavsif</label>
                    <textarea 
                      value={nftData.desc}
                      onChange={(e) => setNftData({...nftData, desc: e.target.value})}
                      rows="3"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 transition-all"
                      placeholder="NFT haqida qisqacha ma'lumot..."
                    ></textarea>
                  </div>

                  <button 
                    onClick={handleMint}
                    disabled={!isConnected || isSigning || isConfirming}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg shadow-xl shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-3"
                  >
                    {isSigning || isConfirming ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    {isSigning ? "Hamyonda imzolanmoqda..." : isConfirming ? "Minting process..." : "NFT Yarating"}
                  </button>

                  {(isConfirmed || hash) && (
                    <div className={`p-4 rounded-xl border mt-6 flex items-center justify-between ${isConfirmed ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                      <div className="flex items-center gap-3">
                        {isConfirmed ? <CheckCircle /> : <Loader2 className="animate-spin" />}
                        <span className="text-sm font-medium">{isConfirmed ? "Muvaffaqiyatli Mint qilindi!" : "Tranzaksiya yuborildi..."}</span>
                      </div>
                      {hash && (
                        <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" className="flex items-center gap-1 text-xs underline">
                          View <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-500">
              {/* Gallery Placeholder */}
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden group">
                  <div className="h-48 bg-slate-800 flex items-center justify-center relative overflow-hidden">
                    <Gem size={40} className="text-indigo-500/20 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1">NFT #{i}</h3>
                    <p className="text-xs text-slate-500 mb-4 truncate">Sepolia Testnet Minted Assets</p>
                    <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all">
                      Tafsilotlar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
