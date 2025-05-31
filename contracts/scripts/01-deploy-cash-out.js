const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying CashOut with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  const network = hre.network.name;
  console.log(`Deploying to ${network}...`);

  const rifToken = "0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE";
  const usdcToken = "0x4ab8f50796b059aE5C8b8534afC6bb4c84912ff6";
  const relayer = "0x0429A2Da7884CA14E53142988D5845952fE4DF6a";

  const CashOut = await ethers.getContractFactory("CashOut");
  const cashOut = await CashOut.deploy(rifToken, usdcToken, relayer);

  await cashOut.waitForDeployment();
  const cashOutAddress = await cashOut.getAddress();

  console.log("CashOut deployed to:", cashOutAddress);

  // Save deployment information
  const deploymentData = {
    network: network,
    cashOut: cashOutAddress,
    timestamp: new Date().toISOString(),
  };

  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }

  fs.writeFileSync(
    path.join(deploymentDir, `${network}-cash-out-deployment.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  // // Verify CashOut contract
  // console.log("Waiting for block confirmations...");
  // await cashOut.deploymentTransaction().wait(5);

  // // Verify contract on Etherscan if not on a local network
  // if (network !== "localhost" && network !== "hardhat") {
  //   console.log("Verifying contract on Etherscan...");
  //   try {
  //     await hre.run("verify:verify", {
  //       address: cashOutAddress,
  //       constructorArguments: [],
  //     });
  //     console.log("Contract verified successfully");
  //   } catch (error) {
  //     console.log("Error verifying contract:", error.message);
  //   }
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
