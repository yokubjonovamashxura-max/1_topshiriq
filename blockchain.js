const crypto = require('crypto');

/**
 * @class Block
 * @description Blokcheynning bitta blokini ifodalaydi.
 */
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0; // Mining (Proof-of-Work) uchun ishlatiladi
        this.hash = this.calculateHash();
    }

    /**
     * Blok ma'lumotlaridan SHA-256 hash hisoblash.
     */
    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index + 
                this.previousHash + 
                this.timestamp + 
                JSON.stringify(this.data) + 
                this.nonce
            )
            .digest('hex');
    }

    /**
     * Proof-of-Work (Mining) jarayoni.
     * Berilgan qiyinchilik (difficulty) darajasiga ko'ra hashni topadi.
     */
    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Blok mayning qilindi: ${this.hash}`);
    }
}

/**
 * @class Blockchain
 * @description Butun zanjirni boshqaradi.
 */
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3; // Mining qiyinchilik darajasi
    }

    /**
     * Zanjirning birinchi blokini yaratish.
     */
    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), "Genesis Block", "0");
    }

    /**
     * Oxirgi blokni olish.
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Yangi blok qo'shish.
     */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty); // Proof-of-Work bajariladi
        this.chain.push(newBlock);
    }

    /**
     * Zanjir validatsiyasi (tekshirish).
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Hash to'g'riligini tekshirish
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Blok #${i} hashi buzilgan!`);
                return false;
            }

            // 2. Oldingi blok bilan bog'liqlikni tekshirish
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Blok #${i} va #${i-1} bog'liqligi buzilgan!`);
                return false;
            }
        }
        return true;
    }
}

// --- DEMO ---
console.log('Blockchain simulyatsiyasi boshlanmoqda...');
let myCoin = new Blockchain();

console.log('Blok #1 mayning qilinmoqda...');
myCoin.addBlock(new Block(1, "2024-05-01", { amount: 50 }));

console.log('Blok #2 mayning qilinmoqda...');
myCoin.addBlock(new Block(2, "2024-05-02", { amount: 100 }));

// Zanjirni ko'rish
console.log('\nBlockchain zanjiri:');
console.log(JSON.stringify(myCoin.chain, null, 4));

// Validatsiyani tekshirish
console.log('\nZanjir validatsiyasi: ' + (myCoin.isChainValid() ? 'Toza ✅' : 'Buzilgan ❌'));

// --- Buzib ko'rish (Integrity Test) ---
console.log('\nBlok #1 ma\'lumotlarini o\'zgartirib ko\'ramiz...');
myCoin.chain[1].data = { amount: 1000000 };
// myCoin.chain[1].hash = myCoin.chain[1].calculateHash(); // Xattoki hashni qayta hisoblasa ham chain buziladi

console.log('Zanjir validatsiyasi (Buzilgandan so\'ng): ' + (myCoin.isChainValid() ? 'Toza ✅' : 'Buzilgan ❌'));
