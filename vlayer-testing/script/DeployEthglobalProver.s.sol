// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EthGlobalInvoiceProver} from "../src/vlayer/EthGlobalInvoiceProver.sol";

contract EthglobalProverScript is Script {
    EthGlobalInvoiceProver public ethglobalProver;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        ethglobalProver = new EthGlobalInvoiceProver();

        vm.stopBroadcast();
    }
}
