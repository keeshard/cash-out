// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EthGlobalInvoiceProver} from "../src/vlayer/EthGlobalInvoiceProver.sol";

contract RegisterClaimScript is Script {
    function run() public {
        // Replace this with the address from the deploy script output
        address proverAddress = 0xf97d85DF6c4D2b032645EE2C2D24423Ed66793f4;

        // Example values to register
        address targetWallet = 0x0429A2Da7884CA14E53142988D5845952fE4DF6a;
        string memory email = "gabrielantony56@gmail.com";
        string memory hackathonName = "ETHGlobal Trifecta - Agents";
        string memory projectName = "WalletSheets";

        vm.startBroadcast();

        EthGlobalInvoiceProver(proverAddress).registerClaim(
            targetWallet,
            email,
            hackathonName,
            projectName
        );

        vm.stopBroadcast();
    }
}
