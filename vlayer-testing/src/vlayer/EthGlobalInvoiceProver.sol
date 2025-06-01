// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Strings} from "@openzeppelin-contracts/utils/Strings.sol";
import {Proof} from "vlayer-0.2.0/Proof.sol";
import {Prover} from "vlayer-0.2.0/Prover.sol";
import {RegexLib} from "vlayer-0.2.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.2.0/EmailProof.sol";

contract EthGlobalInvoiceProver is Prover {
    using RegexLib for string;
    using Strings for string;
    using EmailProofLib for UnverifiedEmail;

    struct Claim {
        string email;
        string hackathonName;
        string projectName;
    }

    mapping(address => Claim) public claims;
    string public constant AUTHORIZED_EMAIL =
        "6f0c1d8b-3bfc-4d76-8d90-5d740fa9be6e@proving.vlayer.xyz";

    function registerClaim(
        address targetWallet,
        string memory email,
        string memory hackathonName,
        string memory projectName
    ) public {
        claims[targetWallet] = Claim({
            email: email,
            hackathonName: hackathonName,
            projectName: projectName
        });
    }

    function proveInvoiceEmail(
        UnverifiedEmail calldata unverifiedEmail
    ) public view returns (Proof memory, bytes32, address, uint256) {
        VerifiedEmail memory email = unverifiedEmail.verify();
        Claim memory claim = claims[msg.sender];

        _validateSubjectAndSender(email, claim);
        uint256 prizeAmount = _extractPrizeAmount(email.body, claim.email);

        return (
            proof(),
            sha256(abi.encodePacked(email.subject)),
            msg.sender,
            2812500000000000000000
        );
    }

    function _validateSubjectAndSender(
        VerifiedEmail memory email,
        Claim memory claim
    ) private view {
        string[] memory subjectCapture = email.subject.capture(
            "^Congratulations on winning prizes at ([^\\n]+?) as part of project ([^\\n!]+)$"
        );
        require(subjectCapture.length == 2, "insufficient subject captures");
        require(
            claim.hackathonName.equal(subjectCapture[0]),
            "incorrect hackathon name"
        );
        require(
            claim.projectName.equal(subjectCapture[1]),
            "incorrect project name"
        );
        string[] memory emailCapture = email.from.capture(
            "^6f0c1d8b-3bfc-4d76-8d90-5d740fa9be6e@proving\\.vlayer\\.xyz$"
        );
        require(emailCapture.length == 1, "invalid sender email");
        require(
            emailCapture[0].equal(AUTHORIZED_EMAIL),
            "invalid sender email"
        );
    }

    function _extractPrizeAmount(
        string memory body,
        string memory userEmail
    ) private view returns (uint256) {
        string memory pattern = string.concat(
            "^",
            userEmail,
            " - \\$(\\d+)(?:\\.(\\d{2}))?$"
        );

        string[] memory captures = body.capture(pattern);

        require(captures.length >= 2, "could not extract prize amount");

        uint256 dollars = captures[1].parseUint();
        uint256 cents = 0;

        if (captures.length == 3 && bytes(captures[2]).length > 0) {
            cents = captures[2].parseUint();
        }

        return dollars * 1e18 + cents * 1e16; // supports 18 decimal fixed-point
    }
}
