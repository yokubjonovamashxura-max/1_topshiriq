// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HospitalQueue
 * @dev Shifoxonada navbat olish va to'lovlarni boshqarish uchun smart-kontrakt
 */
contract HospitalQueue {
    address public owner;
    address public authorizedPayor; // Faqat shu adresdan to'lov qabul qilinadi
    address public hospitalVault;   // Mablag'lar yo'naltiriladigan adres
    uint256 public minFee = 0.01 ether;

    struct Appointment {
        uint256 id;
        address patient;
        uint256 amount;
        string queueType; // Oddiy yoki Shoshilinch
        uint256 timestamp;
    }

    mapping(uint256 => Appointment) public appointments;
    mapping(address => uint256) public userBalances;
    uint256 public appointmentCount;

    event AppointmentCreated(uint256 indexed id, address indexed patient, string queueType, uint256 amount);
    event FundsForwarded(address to, uint256 amount);
    event Withdraw(address to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Faqat kontrakt egasi buni bajara oladi");
        _;
    }

    constructor(address _authorizedPayor, address _hospitalVault) {
        owner = msg.sender;
        authorizedPayor = _authorizedPayor;
        hospitalVault = _hospitalVault;
    }

    /**
     * @dev Navbat olish funksiyasi. Faqat belgilangan adresdan to'lov qabul qiladi.
     */
    function takeAppointment() public payable {
        // 1. Faqat ma'lum adresdan kelgan to'lovni tekshirish
        require(msg.sender == authorizedPayor, "Sizga to'lov qilishga ruxsat berilmagan");

        // 2. Minimal to'lov miqdorini tekshirish
        require(msg.value >= minFee, "Minimal to'lov miqdori 0.01 ETH");

        string memory qType;
        
        // 3. if/else yordamida turli holatlarni boshqarish
        if (msg.value >= 0.05 ether) {
            qType = "Shoshilinch (Urgent)";
        } else {
            qType = "Oddiy (Regular)";
        }

        appointmentCount++;
        appointments[appointmentCount] = Appointment({
            id: appointmentCount,
            patient: msg.sender,
            amount: msg.value,
            queueType: qType,
            timestamp: block.timestamp
        });

        // 4. mapping yordamida balansni yangilash
        userBalances[msg.sender] += msg.value;

        emit AppointmentCreated(appointmentCount, msg.sender, qType, msg.value);

        // 5. Mablag'ni boshqa adresga (g'aznaga) o'tkazish
        (bool success, ) = hospitalVault.call{value: msg.value}("");
        if (success) {
            emit FundsForwarded(hospitalVault, msg.value);
        }
    }

    /**
     * @dev Kontrakt sozlamalarini o'zgartirish (Faqat owner uchun)
     */
    function setAuthorizedPayor(address _newPayor) public onlyOwner {
        authorizedPayor = _newPayor;
    }

    function setHospitalVault(address _newVault) public onlyOwner {
        hospitalVault = _newVault;
    }

    /**
     * @dev Balansni yechib olish (Faqat owner uchun)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Kontraktda mablag' mavjud emas");
        
        payable(owner).transfer(balance);
        emit Withdraw(owner, balance);
    }

    // Kontraktga to'g'ridan-to'g'ri ETH yuborilganda xatolik chiqishi uchun
    receive() external payable {
        revert("Iltimos, takeAppointment funksiyasidan foydalaning");
    }
}
