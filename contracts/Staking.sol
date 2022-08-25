// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Staking is ERC20 {
	event Deposit(uint256 stakeId);
	event Withdraw(uint256 stakeId);

	uint256 public constant MINIMAL_STAKE = 5 ether;

	/**
	* @dev Offchain calculated using tripartite "10% is a year, how many % is one second?"
	* ~0.0000003% per second == ~10% APR; 18 decimals
	*/
	uint256 public constant RATE_PER_SECOND = 3_168_876_462;

	AggregatorV3Interface immutable priceFeed;

	constructor(AggregatorV3Interface _priceFeed) ERC20("devUSDC", "devUSDC") {
		priceFeed = _priceFeed;
	}

	/**
	 * @dev Assuming that any user is not going to stake more than 2^128 wei (approx. "3.4 * 1e38" wei, or "3 and 20 zeros" ETH),
	 * @dev we can fit all information into one slot, saving tx fees
	 */
	struct Stake {
		bool isActive;
		address staker;
		uint48 since;
		uint128 amount;
	}
	Stake[] public stakes;

	function deposit() external payable returns (uint256 stakeId) {
		require(msg.value >= MINIMAL_STAKE, "STAKE_TOO_LOW");

		stakeId = stakes.length;
		stakes.push(Stake(true, msg.sender, uint48(block.timestamp), uint128(msg.value)));

		emit Deposit(stakeId);
	}

	function withdraw(uint256 stakeId) external returns (bool success) {
		Stake memory stake = stakes[stakeId];
		require(stake.isActive, "ALREADY_WITHDRAWN");
		require(stake.staker == msg.sender, "NOT_YOUR_STAKE");

		_mint(msg.sender, getRewardAmount(stake));
		payable(msg.sender).transfer(stake.amount);

		emit Withdraw(stakeId);
		return true;
	}

	function getRewardAmount(Stake memory stake) private view returns (uint256 rewardAmount) {
		uint256 rewardWei = (stake.amount * RATE_PER_SECOND * (block.timestamp - stake.since)) / 1e18;
		(,int256 priceEthUsd,,,) = priceFeed.latestRoundData(); // 8 decimals
		uint256 rewardUsd = (uint256(priceEthUsd) * rewardWei) / 1e10; // 18 decimals
		return rewardUsd;
	}
}
