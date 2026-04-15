// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LogisticsSystem
 * @dev Mahsulotlarni ishlab chiqaruvchidan iste'molchigacha kuzatish tizimi
 */
contract LogisticsSystem {
    enum Status { Manufactured, InTransit, Delivered, Canceled }

    struct TrackingPoint {
        string location;
        uint256 timestamp;
        Status status;
        address handledBy;
    }

    struct Product {
        uint256 id;
        string name;
        string description;
        address currentOwner;
        address manufacturer;
        Status status;
        TrackingPoint[] history;
        bool exists;
    }

    address public owner;
    uint256 private _productIds;
    mapping(uint256 => Product) private products;

    event ProductAdded(uint256 id, string name, address manufacturer);
    event StatusUpdated(uint256 id, Status status, string location);
    event OwnershipTransferred(uint256 id, address from, address to);

    constructor() {
        owner = msg.sender;
    }

    // 1. Mahsulotni tizimga birinchi marta kiritish
    function addProduct(string memory _name, string memory _description, string memory _location) public returns (uint256) {
        _productIds++;
        uint256 newId = _productIds;

        Product storage newProduct = products[newId];
        newProduct.id = newId;
        newProduct.name = _name;
        newProduct.description = _description;
        newProduct.currentOwner = msg.sender;
        newProduct.manufacturer = msg.sender;
        newProduct.status = Status.Manufactured;
        newProduct.exists = true;

        newProduct.history.push(TrackingPoint({
            location: _location,
            timestamp: block.timestamp,
            status: Status.Manufactured,
            handledBy: msg.sender
        }));

        emit ProductAdded(newId, _name, msg.sender);
        return newId;
    }

    // 2. Yetkazib berish holatini yangilash
    function updateStatus(uint256 _productId, Status _status, string memory _location) public {
        require(products[_productId].exists, "Mahsulot topilmadi");
        require(products[_productId].currentOwner == msg.sender, "Siz joriy ega emassiz");

        Product storage product = products[_productId];
        product.status = _status;
        product.history.push(TrackingPoint({
            location: _location,
            timestamp: block.timestamp,
            status: _status,
            handledBy: msg.sender
        }));

        emit StatusUpdated(_productId, _status, _location);
    }

    // 3. Mahsulot egasini o'zgartirish (Transfer Ownership)
    function transferOwnership(uint256 _productId, address _newOwner) public {
        require(products[_productId].exists, "Mahsulot topilmadi");
        require(products[_productId].currentOwner == msg.sender, "Siz joriy ega emassiz");

        address oldOwner = products[_productId].currentOwner;
        products[_productId].currentOwner = _newOwner;

        emit OwnershipTransferred(_productId, oldOwner, _newOwner);
    }

    // 4. Mahsulot tarixini (Audit Trail) va qayerdaligini ko'rish
    function getProduct(uint256 _productId) public view returns (
        string memory name,
        address currentOwner,
        Status status,
        TrackingPoint[] memory history
    ) {
        require(products[_productId].exists, "Mahsulot topilmadi");
        Product storage product = products[_productId];
        return (product.name, product.currentOwner, product.status, product.history);
    }

    // 5. Haqiqiyligini tekshirish
    function verifyProduct(uint256 _productId) public view returns (bool) {
        return products[_productId].exists;
    }
}
