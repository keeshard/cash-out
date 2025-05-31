const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Test USDC with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  const network = hre.network.name;
  console.log(`Deploying to ${network}...`);

  const TestUSDC = await ethers.getContractFactory("TestUSDC");
  const testUSDC = await TestUSDC.deploy();

  await testUSDC.waitForDeployment();
  const testUSDCAddress = await testUSDC.getAddress();

  console.log("TestUSDC deployed to:", testUSDCAddress);

  // Save deployment information
  const deploymentData = {
    network: network,
    testUSDC: testUSDCAddress,
    timestamp: new Date().toISOString(),
  };

  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }

  fs.writeFileSync(
    path.join(deploymentDir, `${network}-usdc-deployment.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  // Verify Tokens contract
  //   console.log("Waiting for block confirmations...");
  //   await cashOut.deploymentTransaction().wait(5);

  // Verify contract on Etherscan if not on a local network
  //   if (network !== "localhost" && network !== "hardhat") {
  //     console.log("Verifying contract on Etherscan...");
  //     try {
  //       await hre.run("verify:verify", {
  //         address: cashOutAddress,
  //         constructorArguments: [],
  //       });
  //       console.log("Contract verified successfully");
  //     } catch (error) {
  //       console.log("Error verifying contract:", error.message);
  //     }
  //   }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
