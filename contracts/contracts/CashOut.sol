// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

contract CashOut {
    enum InvoiceStatus {
        Settled,
        Claimed
    }
    struct User {
        string metadata;
        bool exists;
    }

    struct Business {
        string metadata;
        uint256 creditLimit;
        uint256 availableCredit;
        bool exists;
    }

    struct Invoice {
        uint256 id;
        address creator;
        address business;
        uint256 amount;
        address token;
        string metadata;
        uint256 claimedAt;
        uint256 settledAt;
        InvoiceStatus status;
        bytes32 dataHash;
    }

    mapping(address => User) public users;
    mapping(address => Business) public businesses;
    mapping(uint256 => Invoice) public invoices;

    IERC20 public immutable RIF_TOKEN;
    IERC20 public immutable USD_TOKEN;
    uint256 public invoiceCount;
    address public owner;
    address public relayer;

    event UserCreated(address indexed userAddress, string metadata);
    event BusinessCreated(address indexed businessAddress, string metadata);
    event InvoiceClaimTriggered(
        uint256 indexed id,
        address indexed creator,
        address indexed business,
        uint256 amount
    );
    event InvoiceSettled(
        uint256 indexed id,
        address indexed business,
        uint256 amount
    );
    event InvoiceClaimed(
        uint256 indexed id,
        address indexed creator,
        uint256 amount
    );
    event InvoiceClaimCompleted(
        uint256 indexed id,
        address indexed account,
        address indexed token,
        uint256 amount
    );
    event InvoiceRejected(uint256 indexed id, address indexed business);
    event BusinessCreditLimitUpgraded(address indexed business, uint256 amount);

    modifier onlyUser() {
        require(users[msg.sender].exists, "Not a registered user");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyBusiness() {
        require(businesses[msg.sender].exists, "Not a registered business");
        _;
    }

    modifier invoiceExists(uint256 _invoiceId) {
        require(_invoiceId < invoiceCount, "Invoice does not exist");
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Not relayer");
        _;
    }

    constructor(address _rifToken, address _usdToken, address _relayer) {
        owner = msg.sender;
        RIF_TOKEN = IERC20(_rifToken);
        USD_TOKEN = IERC20(_usdToken);
        relayer = _relayer;
    }

    function createUser(string memory _metadata) external {
        require(!users[msg.sender].exists, "User already exists");
        require(!businesses[msg.sender].exists, "Caller is business");
        users[msg.sender] = User({metadata: _metadata, exists: true});

        emit UserCreated(msg.sender, _metadata);
    }

    function createBusiness(string memory _metadata) external {
        require(!users[msg.sender].exists, "Caller is user");
        require(!businesses[msg.sender].exists, "Business already exists");

        businesses[msg.sender] = Business({
            metadata: _metadata,
            creditLimit: 0,
            availableCredit: 0,
            exists: true
        });
        emit BusinessCreated(msg.sender, _metadata);
    }

    function upgradeLimit(
        address _account,
        uint256 _amount
    ) external onlyRelayer {
        require(businesses[_account].exists, "Not a registered business");
        businesses[_account].creditLimit += _amount;
        emit BusinessCreditLimitUpgraded(_account, _amount);
    }

    function triggerInvoiceClaim(
        address _business,
        address _token,
        uint256 _amount,
        string memory _metadata
    ) external onlyUser {
        require(businesses[_business].exists, "Business does not exist");

        bytes32 dataHash = keccak256(
            abi.encode(
                invoiceCount,
                msg.sender,
                _business,
                _amount,
                _metadata,
                block.timestamp
            )
        );

        invoices[invoiceCount] = Invoice({
            id: invoiceCount,
            creator: msg.sender,
            business: _business,
            amount: _amount,
            metadata: _metadata,
            token: _token,
            claimedAt: 0,
            settledAt: 0,
            status: InvoiceStatus.Settled,
            dataHash: dataHash
        });

        emit InvoiceClaimTriggered(
            invoiceCount,
            msg.sender,
            _business,
            _amount
        );
        invoiceCount++;
    }

    function completeInvoiceClaim(
        address _account,
        uint256 _invoiceId,
        uint256 _amountInUsd
    ) external onlyRelayer {
        address _token = invoices[_invoiceId].token;
        uint256 _claimedAmount;
        if (_token == address(USD_TOKEN)) {
            _claimedAmount = _amountInUsd;
            USD_TOKEN.transfer(_account, _amountInUsd);
        } else if (_token == address(RIF_TOKEN)) {
            _claimedAmount = (_amountInUsd * 5528) / 100000;
            RIF_TOKEN.transfer(_account, (_amountInUsd * 5528) / 100000); // Static price conversion, will be dynamic when going to production
        } else {
            revert("invalid token");
        }

        emit InvoiceClaimCompleted(
            _invoiceId,
            _account,
            _token,
            _claimedAmount
        );
    }

    function settleInvoice(
        uint256 _invoiceId
    ) external invoiceExists(_invoiceId) {
        Invoice storage invoice = invoices[_invoiceId];

        require(
            invoice.status == InvoiceStatus.Claimed,
            "Invoice is already settled"
        );

        invoice.status = InvoiceStatus.Settled;

        require(
            RIF_TOKEN.transferFrom(msg.sender, address(this), invoice.amount),
            "Token transfer failed"
        );

        emit InvoiceSettled(_invoiceId, invoice.business, invoice.amount);
    }

    function setRelayer(address _relayer) external onlyOwner {
        relayer = _relayer;
    }

    function recoverSigner(
        bytes32 _hash,
        bytes memory _signature
    ) internal pure returns (address) {
        require(_signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        // v must be 27 or 28
        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature 'v' value");

        return ecrecover(_hash, v, r, s);
    }
}
