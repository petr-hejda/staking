import { ethers } from "hardhat";
import 'dotenv/config';

async function main() {
	const stakingFactory = await ethers.getContractFactory("Staking");
	const staking = await stakingFactory.deploy(process.env.PRICE_FEED_ADDRESS || "");
	await staking.deployed();
	console.log(`Deployed to ${staking.address}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
