// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TwitterProver} from "../src/vlayer/TwitterProver.sol";

contract TwitterProverScript is Script {
    TwitterProver public twitterProver;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        twitterProver = new TwitterProver();

        vm.stopBroadcast();
    }
}
