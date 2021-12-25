# A simple yield farm exchange that lets users stake ERC20/DAI tokens and accrue interest of ERC20 tokens:

- This smart contract lets you stake ERC20 tokens (DAI) and accrue interest of ERC20 tokens (flux tokens).
  
## Workflow:
- Stake Tokens
- Accrue interest of 1 DAI for each staked ERC20 token for each day staked
- withdraw yield to receive accrued interest
- unstake tokens to recieve back your staked DAI



## Directory structure:
- contracts: Smart contracts that are deployed in Rinkeby testnet:
  1) Escrow.sol : farming smart contract.
  2) FluxTokens.sol : reward/ineterest ERC20 tokens.
  3) MockERC20.sol: to mock DAI tokens.
- migrations: Migration files for deploying contracts in contracts directory.
- test: Tests for smart contracts.
- Docs: smart contracts auto generated docs using @primitivefi/hardhat-dodoc

## How to run this project locally:
### Prerequisites:
- Node.js >= v14
- Hardhat 
- Npm

### Contracts:
- Run (sudo) npm install in project root to install dependencies.
- Run test using: $npx hardhat test tests/contracts.test.ts
  




