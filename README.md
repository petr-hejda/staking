## Description

Example implementation of a staking contract. 10% APY, allows for multiple stakes from one address.

## Install

```
npm i
```

## Test

```
npm test
```

Test result:

```
  Staking
    ✔ Deposits 5 ETH, waits a month, and then withdraws the deposit and reward (1005ms)
    ✔ Fails to deposit less than 5 ETH
    ✔ Fails to withdraw from non-existent stake
    ✔ Fails to withdraw from someone else's stake (38ms)

  4 passing (1s)
```

## Deploy & Verify

The repo is prepared to deploy your contract to the Goerli testnet and verify your contract on Etherscan. 

```
cp .env-example .env
nano .env    # use your favorite editor to set the values
npx hardhat run scripts/deploy.ts --network goerli
npx hardhat verify --network goerli "<CONTRACT_ADDRESS>" "<PRICE_FEED_ADDRESS>"
```

## Live demo

On Goerli testnet: https://goerli.etherscan.io/address/0x1dE21e6Ab3430900BF8655586ff460dfa976E418#code
