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

  const testUSDC = await ethers.getContractAt(
    "TestUSDC",
    "0x4ab8f50796b059aE5C8b8534afC6bb4c84912ff6"
  );

  // const testWBTC = await ethers.getContractAt(
  //   "TestWBTC",
  //   "0x30DFfC0693bb1bBd756bDFFdc8df5F56cc2d30C2"
  // );

  // const testLINK = await ethers.getContractAt(
  //   "TestLINK",
  //   "0x35BFcbcFEb65db335e65256690677eF26fE8da88"
  // );

  await testUSDC.mint(
    "0x935A5B36C923CDFfD3986f2488E92Cf2D1d8c09D",
    ethers.parseUnits("1000000", 18)
  );
  // await testWBTC.mint(deployer.address, ethers.parseUnits("2", 8));
  // await testLINK.mint(deployer.address, ethers.parseUnits("12", 18));

  console.log("Tokens minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
