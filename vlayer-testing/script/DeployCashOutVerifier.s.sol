// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CashOutVerifier} from "../src/vlayer/CashOutVerifier.sol";

contract CashOutVerifierScript is Script {
    CashOutVerifier public cashOutVerifier;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        cashOutVerifier = new CashOutVerifier(
            0x9Fdd1aBd04EfB20dfcB96F104a478Cff4070c6a2
        );

        vm.stopBroadcast();
    }
}
