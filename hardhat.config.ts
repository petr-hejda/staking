import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import 'dotenv/config';

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.16",
		settings: {
			optimizer: {
				enabled: true,
				runs: 2
			}
		}
	},
	networks: {
		goerli: {
			url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""]
		}
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY
	}
};

export default config;
