// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedicalSystem
 * @dev Poliklinika uchun elektron tibbiy kartalar va ruxsatnomalar tizimi
 */
contract MedicalSystem {
    struct Record {
        string diagnosis;
        string treatment;
        address doctor;
        uint256 timestamp;
    }

    struct Patient {
        string name;
        uint256 age;
        Record[] records;
        bool exists;
    }

    address public owner;
    mapping(address => Patient) private patients;
    mapping(address => mapping(address => bool)) private permissions; // Patient => Doctor => HasAccess
    mapping(string => bool) public validMedicines; // Dori haqiqiyligini tekshirish

    event AccessLogged(address indexed patient, address indexed accessor, string action, uint256 timestamp);
    event PatientRegistered(address indexed patient, string name);
    event RecordAdded(address indexed patient, address indexed doctor, string diagnosis);

    modifier onlyOwner() {
        require(msg.sender == owner, "Faqat tizim egasi uchun");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // 1. Bemor ro'yxatdan o'tishi
    function registerPatient(string memory _name, uint256 _age) public {
        require(!patients[msg.sender].exists, "Bemor allaqachon ro'yxatdan o'tgan");
        patients[msg.sender].name = _name;
        patients[msg.sender].age = _age;
        patients[msg.sender].exists = true;
        emit PatientRegistered(msg.sender, _name);
    }

    // 2. Shifokorga ruxsat berish
    function grantAccess(address _doctor) public {
        permissions[msg.sender][_doctor] = true;
        emit AccessLogged(msg.sender, _doctor, "GRANT_ACCESS", block.timestamp);
    }

    // 3. Ruxsatni bekor qilish
    function revokeAccess(address _doctor) public {
        permissions[msg.sender][_doctor] = false;
        emit AccessLogged(msg.sender, _doctor, "REVOKE_ACCESS", block.timestamp);
    }

    // 4. Ma'lumot qo'shish (Faqat ruxsat berilgan shifokor)
    function addMedicalRecord(address _patient, string memory _diagnosis, string memory _treatment) public {
        require(permissions[_patient][msg.sender], "Sizda ushbu bemorga kirish ruxsati yo'q");
        
        patients[_patient].records.push(Record({
            diagnosis: _diagnosis,
            treatment: _treatment,
            doctor: msg.sender,
            timestamp: block.timestamp
        }));

        emit RecordAdded(_patient, msg.sender, _diagnosis);
        emit AccessLogged(_patient, msg.sender, "ADD_RECORD", block.timestamp);
    }

    // 5. Ma'lumot o'qish (Bemor o'zi yoki ruxsat berilgan shifokor)
    function getMedicalRecords(address _patient) public returns (Record[] memory) {
        require(msg.sender == _patient || permissions[_patient][msg.sender], "Kirish ruxsati yo'q");
        
        emit AccessLogged(_patient, msg.sender, "READ_RECORDS", block.timestamp);
        return patients[_patient].records;
    }

    // 6. Dori haqiqiyligini tekshirish
    function verifyMedicine(string memory _serialNumber) public view returns (bool) {
        return validMedicines[_serialNumber];
    }

    // 7. Dorilarni bazaga qo'shish (Faqat owner uchun)
    function addMedicine(string memory _serialNumber) public onlyOwner {
        validMedicines[_serialNumber] = true;
    }

    // Bemor nomi va yoshini olish
    function getPatientInfo(address _patient) public view returns (string memory name, uint256 age) {
        require(msg.sender == _patient || permissions[_patient][msg.sender], "Kirish ruxsati yo'q");
        return (patients[_patient].name, patients[_patient].age);
    }
}
