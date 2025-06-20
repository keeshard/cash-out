// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {TwitterProver} from "./TwitterProver.sol";

import {Proof} from "vlayer-0.2.0/Proof.sol";
import {Verifier} from "vlayer-0.2.0/Verifier.sol";

import {ERC721} from "@openzeppelin-contracts/token/ERC721/ERC721.sol";

contract WebProofVerifier is Verifier, ERC721 {
    address public prover;

    mapping(uint256 => string) public tokenIdToMetadataUri;

    constructor(address _prover) ERC721("TwitterNFT", "TNFT") {
        prover = _prover;
    }

    function verify(
        Proof calldata,
        string memory username,
        address account
    ) public onlyVerified(prover, TwitterProver.main.selector) {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(username)));
        require(
            _ownerOf(tokenId) == address(0),
            "User has already minted a TwitterNFT"
        );

        _safeMint(account, tokenId);
        tokenIdToMetadataUri[tokenId] = string.concat(
            "https://faucet.vlayer.xyz/api/xBadgeMeta?handle=",
            username
        );
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return tokenIdToMetadataUri[tokenId];
    }
}
