// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {IERC20} from "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import {Strings} from "@openzeppelin-contracts/utils/Strings.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {Web, WebProof, WebProofLib, WebLib} from "vlayer-0.1.0/WebProof.sol";
import {Precompiles} from "vlayer-0.1.0/PrecompilesAddresses.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract CashOutProver is Prover {
    using Strings for string;
    using RegexLib for string;
    using WebProofLib for WebProof;
    using WebLib for Web;

    struct Erc20Token {
        uint256 chainId;
        uint256 startBlock;
        address[] addrs;
    }

    struct SupportedToken {
        uint256 chainId;
        bytes32 priceFeedId;
        uint8 decimals;
    }

    mapping(address => SupportedToken) public supportedTokens;

    uint256 public constant ITERATIONS = 2;
    uint256 public constant BLOCK_INTERVAL = 200;
    string public constant BYBIT_DATA_URL =
        "https://api2.bybit.com/v3/private/cht/asset-show/asset-total-balance?quoteCoin=BTC";

    string public constant BINANCE_DATA_URL =
        "https://www.binance.com/bapi/asset/v2/private/asset-service/wallet/balance?quoteAsset=USDT";

    address public immutable owner;
    IPyth pyth;

    constructor(
        address _owner,
        address[] memory _supportedTokens,
        uint256[] memory chainIds,
        bytes32[] memory priceFeedIds,
        uint8[] memory decimals
    ) {
        owner = _owner;
        for (uint256 i = 0; i < _supportedTokens.length; i++) {
            supportedTokens[_supportedTokens[i]] = SupportedToken(
                chainIds[i],
                priceFeedIds[i],
                decimals[i]
            );
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function proveBasic(
        address token,
        uint256 chainId,
        uint256 startBlock,
        address _owner
    ) public returns (Proof memory, address, uint256) {
        setChain(chainId, startBlock);
        uint256 balance = IERC20(token).balanceOf(_owner);
        return (proof(), _owner, balance);
    }

    function proveBalance(
        address[2] memory _tokens,
        uint256[2] memory _chains,
        uint256[2] memory _startBlocks,
        address _owner
    ) public returns (Proof memory, address, uint256) {
        uint256 totalBalance = 0;

        for (uint256 i = 0; i < 2; i++) {
            for (uint256 j = 0; j < ITERATIONS; j++) {
                setChain(_chains[i], _startBlocks[i] - j * BLOCK_INTERVAL);
                totalBalance += IERC20(_tokens[i]).balanceOf(_owner);
            }
        }

        return (proof(), _owner, totalBalance);
    }

    function proveEvmCrosschainBalance(
        Erc20Token[] memory _tokens,
        address _owner
    ) public returns (Proof memory, address, uint256) {
        uint256 avgUsdBalance = 0;

        // for (uint256 i = 0; i < _tokens.length; i++) {
        //     for (uint256 j = 0; j < _tokens[i].addrs.length; j++) {
        //         if (
        //             supportedTokens[_tokens[i].addrs[j]].priceFeedId ==
        //             bytes32(0)
        //         ) {
        //             continue;
        //         }
        //         uint256 totalAssetBalance = 0;
        //         for (uint256 k = 0; k < ITERATIONS; k++) {
        //             setChain(
        //                 _tokens[i].chainId,
        //                 _tokens[i].startBlock - k * BLOCK_INTERVAL
        //             );
        //             totalAssetBalance += IERC20(_tokens[i].addrs[j]).balanceOf(
        //                 _owner
        //             );
        //         }
        //     }
        // }
        // for (uint256 i = 0; i < _tokens.length; i++) {
        //     for (uint256 j = 0; j < _tokens[i].addrs.length; j++) {
        //         if (
        //             supportedTokens[_tokens[i].addrs[j]].priceFeedId ==
        //             bytes32(0)
        //         ) {
        //             continue;
        //         }
        //         uint256 totalAssetBalance = 0;
        //         for (uint256 k = 0; k < ITERATIONS; k++) {
        //             setChain(
        //                 _tokens[i].chainId,
        //                 _tokens[i].startBlock - k * BLOCK_INTERVAL
        //             );
        //             totalAssetBalance += IERC20(_tokens[i].addrs[j]).balanceOf(
        //                 _owner
        //             );
        //         }
        //     }
        //     uint256 endBlock = _tokens[i].startBlock;
        //     uint256 totalAssetBalance = 0;
        //     for (
        //         uint256 j = _tokens[i].startBlock;
        //         j > endBlock;
        //         j -= BLOCK_INTERVAL
        //     ) {
        //         setChain(_tokens[i].chainId, j);
        //         totalAssetBalance += IERC20(_tokens[i].addr).balanceOf(_owner);
        //     }
        //     uint256 avgAssetBalance = totalAssetBalance / ITERATIONS;
        //     avgUsdBalance += getUsdValue(_tokens[i].addr, avgAssetBalance);
        // }
        return (proof(), _owner, avgUsdBalance);
    }

    function proveBinanceFunds(
        WebProof calldata webProof,
        address account
    ) public view returns (Proof memory, address, uint256) {
        Web memory web = webProof.verify(BINANCE_DATA_URL);

        string memory code = web.jsonGetString("code");
        require(code.equal("000000"), "Binance API returned error");

        uint256 netUsdBalance = 0;

        for (uint i = 0; i < 10; i++) {
            string memory balancePath = string.concat(
                "data[",
                Strings.toString(i),
                "].balance"
            );
            (bool ok, string memory balance) = tryJsonGetString(
                web,
                balancePath
            );
            if (!ok) break;
            netUsdBalance += usdBalanceParser(balance);
        }

        return (proof(), account, netUsdBalance);
    }

    function proveBybitFunds(
        WebProof calldata webProof,
        address account
    ) public view returns (Proof memory, address, uint256) {
        Web memory web = webProof.verify(BYBIT_DATA_URL);

        string memory ret_msg = web.jsonGetString("ret_msg");
        require(ret_msg.equal("success"), "Bybit API returned error");

        uint256 netUsdBalance = 0;

        for (uint i = 0; i < 12; i++) {
            string memory originBalancePath = string.concat(
                "result.totalBalanceItems[",
                Strings.toString(i),
                "].originBalance"
            );
            (bool ok, string memory originBalance) = tryJsonGetString(
                web,
                originBalancePath
            );
            if (!ok) break;
            netUsdBalance += usdBalanceParser(originBalance);
        }

        return (proof(), account, netUsdBalance);
    }

    function configureSupportedTokens(
        address[] memory _supportedTokens,
        bytes32[] memory priceFeedIds,
        uint8[] memory decimals
    ) external onlyOwner {
        for (uint256 i = 0; i < _supportedTokens.length; i++) {
            supportedTokens[_supportedTokens[i]] = SupportedToken(
                1,
                priceFeedIds[i],
                decimals[i]
            );
        }
    }

    function getUsdValue(
        address token,
        uint256 amount
    ) public view returns (uint256) {
        PythStructs.Price memory price = pyth.getEmaPriceUnsafe(
            supportedTokens[token].priceFeedId
        );
        uint priceInWei = (uint(uint64(price.price)) *
            (10 ** supportedTokens[token].decimals)) /
            (10 ** uint8(uint32(-1 * price.expo)));
        return (priceInWei * amount) / (10 ** 18);
    }

    function tryJsonGetString(
        Web memory web,
        string memory jsonPath
    ) internal view returns (bool, string memory) {
        if (bytes(web.body).length == 0) return (false, "");

        bytes memory encodedParams = abi.encode([web.body, jsonPath]);
        (bool success, bytes memory returnData) = Precompiles
            .JSON_GET_STRING
            .staticcall(encodedParams);

        if (!success) return (false, "");

        return (true, abi.decode(returnData, (string)));
    }

    function usdBalanceParser(
        string memory btcValuation
    ) public view returns (uint256) {
        // Handle zero case
        if (keccak256(bytes(btcValuation)) == keccak256(bytes("0"))) {
            return 0;
        }

        string[] memory captures = btcValuation.capture(
            "^(\\d+)(?:\\.(\\d+))?$"
        );
        require(captures.length >= 2, "could not extract btc valuation");

        uint256 intPart = captures[1].parseUint();

        // Check if decimal part exists
        if (captures.length == 3 && bytes(captures[2]).length > 0) {
            string memory fracPartStr = captures[2];
            uint256 fracLength = bytes(fracPartStr).length;
            uint256 fracValue = fracPartStr.parseUint();
            uint256 fracScale = 1e18 / (10 ** fracLength);
            return intPart * 1e18 + fracValue * fracScale;
        }

        return intPart * 1e18;
    }
}
