// SPDX-License-Identifier: MIT

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestWBTC is ERC20 {
    constructor() ERC20("Test WBTC", "WBTC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
