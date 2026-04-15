// Web3.js Integratsiyasi - Smart Kontrakt bilan ishlash
// Muallif: Antigravity AI

let web3;
let contract;
let userAccount;

// NAMUNAVIY KONTRAKT MA'LUMOTLARI (O'zingiznikiga almashtiring)
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Localhost default address
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			}
		],
		"name": "set",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "get",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// UI Elementlari
const connectBtn = document.getElementById('connectWallet');
const readBtn = document.getElementById('readValue');
const sendBtn = document.getElementById('sendValue');
const walletDisplay = document.getElementById('walletAddress');
const networkDisplay = document.getElementById('networkName');
const storedValueDisplay = document.getElementById('storedValue');
const logConsole = document.getElementById('logConsole');

// Log xabarlarini chiqarish funksiyasi
function log(message, type = 'system') {
    const p = document.createElement('p');
    p.className = `log-msg ${type}`;
    p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logConsole.prepend(p);
    console.log(message);
}

// 1. Hamyonni ulash (MetaMask)
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            log("MetaMask ulanmoqda...");
            // Web3 obyektini yaratish
            web3 = new Web3(window.ethereum);
            
            // Hamyon ruxsatini so'rash
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            walletDisplay.textContent = `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
            
            // Tarmoqni tekshirish
            const chainId = await web3.eth.getChainId();
            networkDisplay.textContent = chainId == 1337 || chainId == 31337 ? "Localhost" : "Boshqa tarmoq";
            
            // Kontrakt obyektini yaratish
            initContract();
            
            log("Hamyon muvaffaqiyatli ulandi!", "system");
            connectBtn.textContent = "Ulandi";
            connectBtn.disabled = true;

        } catch (error) {
            log(`Ulanishda xatolik: ${error.message}`, "error");
        }
    } else {
        log("Iltimos, MetaMask o'rnating!", "error");
        alert("MetaMask topilmadi. Uni brauzeringizga o'rnating.");
    }
}

// 2. Kontraktni inisializatsiya qilish
function initContract() {
    try {
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        log("Smart-kontrakt obyekti yaratildi.");
    } catch (error) {
        log(`Kontraktni yuklashda xatolik: ${error.message}`, "error");
    }
}

// 3. View funksiyasini chaqirish (Data Fetching)
async function readFromContract() {
    if (!contract) return log("Avval hamyonni ulang!", "error");
    
    try {
        log("Ma'lumot o'qilmoqda...");
        // get() funksiyasini chaqiramiz
        const result = await contract.methods.get().call();
        storedValueDisplay.textContent = result;
        log(`Muvaffaqiyatli o'qildi: ${result}`, "system");
    } catch (error) {
        log(`O'qishda xatolik: ${error.message}`, "error");
    }
}

// 4. Tranzaksiya yuborish (Send Method)
async function sendToContract() {
    if (!contract) return log("Avval hamyonni ulang!", "error");
    
    const value = document.getElementById('newValue').value;
    const gasLimit = document.getElementById('gasLimit').value;
    const gasPriceGwei = document.getElementById('gasPrice').value;

    if (!value) return log("Qiymatni kiriting!", "error");

    try {
        log(`Tranzaksiya yuborilmoqda: ${value}...`, "transaction");
        
        // Gwei ni Wei ga o'tkazish
        const gasPriceWei = web3.utils.toWei(gasPriceGwei, 'gwei');

        // set(uint256) funksiyasini chaqiramiz
        const receipt = await contract.methods.set(value).send({
            from: userAccount,
            gas: gasLimit,
            gasPrice: gasPriceWei
        });

        log(`Tranzaksiya tasdiqlandi! Hash: ${receipt.transactionHash.substring(0, 15)}...`, "system");
        
        // Qiymatni avtomatik yangilash
        readFromContract();

    } catch (error) {
        // Error handling mexanizmi
        if (error.code === 4001) {
            log("Foydalanuvchi tranzaksiyani rad etdi.", "error");
        } else {
            log(`Tranzaktsiyada xatolik: ${error.message}`, "error");
        }
    }
}

// Event Listeners
connectBtn.addEventListener('click', connectWallet);
readBtn.addEventListener('click', readFromContract);
sendBtn.addEventListener('click', sendToContract);

// Hamyon o'zgarganda sahifani yangilash
if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => window.location.reload());
    window.ethereum.on('chainChanged', () => window.location.reload());
}
