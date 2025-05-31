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
            0x08206f4746671Dd30DD583bE16092598524882CA
        );

        vm.stopBroadcast();
    }
}
