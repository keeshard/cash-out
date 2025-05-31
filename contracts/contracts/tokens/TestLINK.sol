// SPDX-License-Identifier: MIT

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestLINK is ERC20 {
    constructor() ERC20("Test LINK", "LINK") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
