const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Tokens with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  const network = hre.network.name;

  const pythLogicTester = await ethers.getContractAt(
    "PythLogicTester",
    "0xD4171D5a25B3A684d1952Dd8141fA27911004f12"
  );

  const balance = await pythLogicTester.crossChainBalanceOf(
    [
      [11155420, "0x30DFfC0693bb1bBd756bDFFdc8df5F56cc2d30C2", 22221],
      [11155420, "0x86c207ebF3aE9e9A93B9a045360a8f5Fc983C777", 22221],
      [11155420, "0x35BFcbcFEb65db335e65256690677eF26fE8da88", 22221],
    ],
    [
      ethers.parseUnits("1", 18),
      ethers.parseUnits("1", 18),
      ethers.parseUnits("1", 18),
    ]
  );

  console.log("BTC USD Value:", balance);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
