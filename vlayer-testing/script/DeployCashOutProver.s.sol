// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CashOutProver} from "../src/vlayer/CashOutProver.sol";

contract CashOutProverScript is Script {
    CashOutProver public cashOutProver;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address[] memory supportedTokens = new address[](6);
        supportedTokens[0] = 0x4393eD225A2F48C27eA6CeBec139190cb8EA8A5F;
        supportedTokens[1] = 0x8611bbb8395d3333622A9D65dcaB2e4b1fE644b5;
        supportedTokens[2] = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
        supportedTokens[3] = 0x5fd84259d66Cd46123540766Be93DFE6D43130D7;
        supportedTokens[4] = 0xC14b762bD6b4C7f40bB06E5613d0C2A1cB0f7E9c;
        supportedTokens[5] = 0x35BFcbcFEb65db335e65256690677eF26fE8da88;

        uint256[] memory chainIds = new uint256[](6);
        chainIds[0] = 84532;
        chainIds[1] = 84532;
        chainIds[2] = 84532;
        chainIds[3] = 11155420;
        chainIds[4] = 11155420;
        chainIds[5] = 11155420;

        bytes32[] memory priceFeedIds = new bytes32[](6);
        priceFeedIds[
            0
        ] = 0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a;
        priceFeedIds[
            1
        ] = 0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33;
        priceFeedIds[
            2
        ] = 0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221;
        priceFeedIds[
            3
        ] = 0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a;
        priceFeedIds[
            4
        ] = 0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33;
        priceFeedIds[
            5
        ] = 0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221;

        uint8[] memory decimals = new uint8[](6);
        decimals[0] = 6;
        decimals[1] = 8;
        decimals[2] = 18;
        decimals[3] = 6;
        decimals[4] = 18;
        decimals[5] = 18;

        cashOutProver = new CashOutProver(
            msg.sender,
            supportedTokens,
            chainIds,
            priceFeedIds,
            decimals
        );

        vm.stopBroadcast();
    }
}
