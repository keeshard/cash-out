// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {CashOutProver} from "./CashOutProver.sol";
import {Proof} from "vlayer-0.2.0/Proof.sol";
import {Verifier} from "vlayer-0.2.0/Verifier.sol";

contract CashOutVerifier is Verifier {
    address public cashOutProver;
    address public owner;
    mapping(bytes32 => bool) public invoiceClaimed;
    mapping(address => bool) public businessInvoiceProvers;
    mapping(address => uint256) public binanceVerifiedUsdAmount;
    mapping(address => uint256) public bybitVerifiedUsdAmount;
    mapping(address => uint256) public crosschainVerifiedUsdAmount;

    struct ProofOutput {
        Proof proof;
        bytes32 bodyHash;
        address account;
        uint256 usdAmount;
    }

    bytes4 public constant PROVE_INVOICE_EMAIL_SELECTOR =
        bytes4(
            keccak256(
                "proveInvoiceEmail((uint256,string,string,string,string,string))"
            )
        );

    constructor(address _cashOutProver) {
        cashOutProver = _cashOutProver;
    }

    event VerifiedInvoice(
        bytes32 indexed bodyHash,
        address indexed account,
        uint256 usdAmount
    );
    event BinanceFundsVerified(address indexed account, uint256 usdAmount);
    event BybitFundsVerified(address indexed account, uint256 usdAmount);
    event CrosschainWalletBalanceVerified(
        address indexed account,
        uint256 usdAmount
    );

    modifier onlyRegisteredProver(address prover) {
        require(businessInvoiceProvers[prover], "Prover not registered");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function registerBusinessInvoiceProver(address prover) external onlyOwner {
        businessInvoiceProvers[prover] = true;
    }
    function verifyCrosschainBalance(
        address account,
        uint256 usdAmount
    ) public {
        crosschainVerifiedUsdAmount[account] = usdAmount;
        emit CrosschainWalletBalanceVerified(account, usdAmount);
    }

    function verifyBybitFunds(
        Proof calldata proof,
        address account,
        uint256 usdAmount
    )
        public
        onlyVerified(cashOutProver, CashOutProver.proveBybitFunds.selector)
    {
        bybitVerifiedUsdAmount[account] = usdAmount;
        emit BybitFundsVerified(account, usdAmount);
    }

    function verifyBinanceFunds(
        Proof calldata proof,
        address account,
        uint256 usdAmount
    )
        public
        onlyVerified(cashOutProver, CashOutProver.proveBinanceFunds.selector)
    {
        binanceVerifiedUsdAmount[account] = usdAmount;
        emit BinanceFundsVerified(account, usdAmount);
    }

    function claimInvoiceAmount(
        ProofOutput calldata proofOutput,
        address prover
    )
        public
        onlyRegisteredProver(prover)
        onlyVerified(prover, PROVE_INVOICE_EMAIL_SELECTOR)
    {
        require(
            !invoiceClaimed[proofOutput.bodyHash],
            "Invoice already claimed"
        );
        invoiceClaimed[proofOutput.bodyHash] = true;
        emit VerifiedInvoice(
            proofOutput.bodyHash,
            proofOutput.account,
            proofOutput.usdAmount
        );
    }
}
