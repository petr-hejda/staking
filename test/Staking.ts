
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", () => {
	let staking;

	async function deployStaking() {
		const accounts = await ethers.getSigners();

		const priceFeedMockFactory = await ethers.getContractFactory("PriceFeedMock");
		const priceFeedMock = await priceFeedMockFactory.deploy();
		await priceFeedMock.deployed();

		const stakingFactory = await ethers.getContractFactory("Staking");
		const staking = await stakingFactory.deploy(priceFeedMock.address);
		await staking.deployed();

		return { accounts, staking };
	}

	it("Deposits 5 ETH, waits a month, and then withdraws the deposit and reward", async () => {
		const { accounts, staking } = await loadFixture(deployStaking);

		await expect(
			staking.deposit({value:  ethers.utils.parseEther("5.0")})
		).to.emit(staking, "Deposit").withArgs(0);

		const SECONDS_IN_A_MONTH = 60 * 60 * 24 * 30;
		await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_MONTH]);

		await expect(
			staking.withdraw(0)
		).to.emit(staking, "Withdraw").withArgs(0)
		.and.to.emit(staking, "Transfer").withArgs(ethers.constants.AddressZero, accounts[0].address, anyValue);
	});

	it("Fails to deposit less than 5 ETH", async () => {
		const { staking } = await loadFixture(deployStaking);

		await expect(
			staking.deposit({value: ethers.utils.parseEther("1.0")})
		).to.be.revertedWith("STAKE_TOO_LOW");
	});

	it("Fails to withdraw from non-existent stake", async () => {
		const { staking } = await loadFixture(deployStaking);

		await expect(
			staking.deposit({value: ethers.utils.parseEther("5.0")})
		).to.emit(staking, "Deposit").withArgs(0);

		await expect(
			staking.withdraw(1)
		).to.be.revertedWithPanic(PANIC_CODES.ARRAY_ACCESS_OUT_OF_BOUNDS);
	});

	it("Fails to withdraw from someone else's stake", async () => {
		const { accounts, staking } = await loadFixture(deployStaking);

		await expect(
			staking.deposit({value: ethers.utils.parseEther("5.0")})
		).to.emit(staking, "Deposit").withArgs(0);

		await expect(
			staking.connect(accounts[1]).withdraw(0),
		).to.be.revertedWith("NOT_YOUR_STAKE");
	});

});
