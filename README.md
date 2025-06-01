# Cash Out

**unlocking instant liquidity for freelancers & SMEs using zk powered by vLayer**

---

## ⚠️ Understanding the problem and need

Late payments in B2B markets are **systemic and damaging**. Trillions are trapped in unpaid invoices, especially harming **freelancers and small businesses**. While privacy is essential, it hinders on-chain financial transparency—until now.

Cash Out bridges the gap by offering **confidential solvency proofs**, **tamper-proof invoice validation**, and **instant stablecoin payouts**, all without trusting a centralized entity.

---

## 📦 Basic Description

**Cash Out** is a decentralized application (dApp) that enables instant invoice claims for freelancers and SMEs using **zero-knowledge proofs**. Built on **Rootstock** and powered by **vLayer**, it allows businesses to prove invoice legitimacy and solvency **without revealing sensitive data**. All claims are executed through Rootstock’s Attestation Service and settled in **stablecoins or $RIF** tokens.

### Technical Explainer

- 🔐 Email parsing → zkSNARK circuit → cryptographic invoice proof
- 🏦 Exchange API (e.g., Binance, Bybit) → ZK portfolio history proof
- 🌉 Teleport + Time Travel zk-modules → multi-chain liquidity average
- 📜 Rootstock Smart Contracts:
  - zk verification
  - claim processing
  - attestation link with metadata hash
- 💱 Oracle-powered price conversion using Pyth Network

All interactions are **fully decentralized**, **permissionless**, and **privacy-preserving**.

---

## 🧪 Built With

- **Rootstock**
- **vLayer**
- **Pyth Network**
- **Rootstock Attestation Service**
- **zkSNARKs / zk-STARKs**
- **Teleport & Time Travel (ZK modules)**

---

## 🧠 Product Workflow

![good](https://github.com/user-attachments/assets/ae138b65-98f2-4636-ba11-4bd2d5fc3901)

---

## 📜 Deployments

### Roostock Testnet

CashOut -
Test USDC -
$RIF token -

RAS Schema -

### Ethereum Sepolia

CashOutProver -
CashOutVerifier -
EthGlobalInvoiceProver -

### Base Sepolia

Test USDC -
Test LINK -
Test WBTC -

### OP Sepolia

Test USDC -
Test LINK -
Test WBTC -

---

## 👩‍💻 Line of code

### Roostock

Create User Profile Tx -
Create Business Profile Tx -
Create Invoice Tx -
Invoice Claim Settlement Tx -
Binance Proof Verification Settlement Tx -
Bybit Proof Verification Settlement Tx -
Crosschain Average Balance Proof Verification Settlement Tx -
$RIF Usage -
RAS Usage -

### vLayer

Proving and claiming credit limit by verifying Binance asset history -
Proving and claiming credit limit by verifying ByBit asset history -
Proving and claiming credit limit by verifying cross chain average balance by using Teleport and Time Travel -
Proving and claiming locked liquidity by verifying email proofs -

### Pyth

Multi asset USD conversion during vLayer Proof generation -
Push Oracle Service Script -

---

## 👤 Authors

- Stinu Rabin 🛠️ Protocol Devloper 
- Keesha 🔍 UI/UX Frontend

__
