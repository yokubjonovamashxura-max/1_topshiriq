// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EduVerify
 * @dev Ta'lim diplomlarini yaratish, saqlash va tekshirish uchun tizim
 */
contract EduVerify {
    struct Certificate {
        uint256 id;
        string studentName;
        string subject;
        string grade;
        address studentAddress;
        address issuer;
        uint256 issueDate;
        bool exists;
    }

    address public owner;
    uint256 private _certificateIds;

    mapping(uint256 => Certificate) private certificates;
    mapping(address => uint256[]) private studentCertificates;
    mapping(address => bool) public authorizedUniversities; // Ruxsat berilgan universitetlar
    // Bemor/Talaba ruxsat bergan ish beruvchilar: Student => Employer => Access
    mapping(address => mapping(address => bool)) private accessPermissions;

    event CertificateIssued(uint256 indexed id, address indexed student, address indexed issuer, string subject);
    event AccessGranted(address indexed student, address indexed accessor);

    modifier onlyOwner() {
        require(msg.sender == owner, "Faqat tizim egasi uchun");
        _;
    }

    modifier onlyUniversity() {
        require(authorizedUniversities[msg.sender] || msg.sender == owner, "Faqat universitetlar diplom bera oladi");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedUniversities[msg.sender] = true;
    }

    // 1. Universitetni avtorizatsiya qilish
    function authorizeUniversity(address _university) public onlyOwner {
        authorizedUniversities[_university] = true;
    }

    // 2. Diplom yaratish (Issue Diploma)
    function issueDiploma(
        address _student, 
        string memory _name, 
        string memory _subject, 
        string memory _grade
    ) public onlyUniversity returns (uint256) {
        _certificateIds++;
        uint256 newId = _certificateIds;

        certificates[newId] = Certificate({
            id: newId,
            studentName: _name,
            subject: _subject,
            grade: _grade,
            studentAddress: _student,
            issuer: msg.sender,
            issueDate: block.timestamp,
            exists: true
        });

        studentCertificates[_student].push(newId);
        emit CertificateIssued(newId, _student, msg.sender, _subject);
        return newId;
    }

    // 3. Ish beruvchiga ruxsat berish
    function grantAccess(address _accessor) public {
        accessPermissions[msg.sender][_accessor] = true;
        emit AccessGranted(msg.sender, _accessor);
    }

    // 4. Diplomni tekshirish (Verification)
    function getCertificate(uint256 _id) public view returns (Certificate memory) {
        Certificate memory cert = certificates[_id];
        require(cert.exists, "Diplom topilmadi");
        
        // Agar o'quvchi o'zi bo'lsa yoki ruxsat bergan bo'lsa ko'rsatiladi
        // (Soddalashtirish uchun tekshiruvni UI darajasida ham qilish mumkin)
        require(
            msg.sender == cert.studentAddress || 
            msg.sender == cert.issuer || 
            accessPermissions[cert.studentAddress][msg.sender], 
            "Kirish ruxsati yo'q"
        );

        return cert;
    }

    // Talabaning barcha diplomlarini olish
    function getMyCertificates() public view returns (uint256[] memory) {
        return studentCertificates[msg.sender];
    }

    // Ochiq tekshirish (Haqiqiyligini tasdiqlash uchun)
    function verifyAuthenticity(uint256 _id) public view returns (bool) {
        return certificates[_id].exists;
    }
}
