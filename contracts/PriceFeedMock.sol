// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

contract PriceFeedMock {
	function latestRoundData() external pure returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) {
		// 1500 USD and 8 decimals
		return (0, 1500 * 1e8, 0, 0, 0);
	}
}
