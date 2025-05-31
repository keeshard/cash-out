const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying OPVerifier with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  const network = hre.network.name;
  console.log(`Deploying to ${network}...`);

  const tokens = [
    {
      name: "USDC",
      tokens: {
        11155420: "0x86c207ebF3aE9e9A93B9a045360a8f5Fc983C777",
        84532: "0x89d5da61548205E755874d7f67Ad00F90680440d",
      },
      priceFeedId:
        "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
      decimals: 18,
    },
    {
      name: "LINK",
      tokens: {
        11155111: "0x35BFcbcFEb65db335e65256690677eF26fE8da88",
        84532: "0x1f60Dc6266A4D0D22D0C3F94Bf3704b857f00AFb",
      },
      priceFeedId:
        "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221",
      decimals: 18,
    },
    {
      name: "WBTC",
      tokens: {
        11155420: "0x30DFfC0693bb1bBd756bDFFdc8df5F56cc2d30C2",
        84532: "0x05aAFbce41C5ad85Be9a7017cB545E631D7aCB38",
      },
      priceFeedId:
        "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33",
      decimals: 18,
    },
  ];

  const PythLogicTester = await ethers.getContractFactory("PythLogicTester");
  const addresses = tokens.map((token) => Object.values(token.tokens)).flat();
  const chainIds = tokens
    .map((token) => Object.keys(token.tokens).map(Number))
    .flat();
  const priceFeedIds = tokens
    .map((token) => [token.priceFeedId, token.priceFeedId])
    .flat();
  const decimals = tokens
    .map((token) => [token.decimals, token.decimals])
    .flat();

  const pythLogicTester = await PythLogicTester.deploy(
    deployer.address,
    "0x0708325268dF9F66270F1401206434524814508b",
    addresses,
    chainIds,
    priceFeedIds,
    decimals
  );

  const cashOut = "0x50751BD8d7b0a84c422DE96A56426a370F31a42D";

  await pythLogicTester.waitForDeployment();
  const pythLogicTesterAddress = await pythLogicTester.getAddress();

  console.log("PythLogicTester deployed to:", pythLogicTesterAddress);

  // Save deployment information
  const deploymentData = {
    network: network,
    pythLogicTester: pythLogicTesterAddress,
    timestamp: new Date().toISOString(),
  };

  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }

  fs.writeFileSync(
    path.join(deploymentDir, `${network}-pyth-testing-deployment.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  // Verify OPVerifier contract
  // console.log("Waiting for block confirmations...");
  // await pythLogicTester.deploymentTransaction().wait(5);

  // // Verify contract on Etherscan if not on a local network
  // if (network !== "localhost" && network !== "hardhat") {
  //   console.log("Verifying contract on Etherscan...");
  //   try {
  //     await hre.run("verify:verify", {
  //       address: opVerifierAddress,
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
