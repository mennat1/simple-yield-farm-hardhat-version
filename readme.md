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

### Tests:
- Run (sudo) npm install in project root to install dependencies.
- First Test (contracts.test.ts):
    1) Run test using: $npx hardhat test tests/contracts.test.js
- Second Test (mainnetFork.test.ts):
  1) Create a mainnet node on Alchemy and place the API key in the .env file
  2) Fetch DAI token address from etherscan mainnet and place it in the .env file (it's already there in the .env.example file tho)
  3) Fetch DAI Whales addresses and place them in the .env file and make sure they have enough eth to make txs (you'll find whales addresses in the .env.example file as well)
  4) Run ($source .env) in the root directory to use those vars
  5) In one terminal run: \
        $ npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/$ALCHEMY_KEY
  6) In another terminal run: \
        $npx hardhat test tests/mainnetFork.test.ts --network mainnet_fork
  7) You can also run contracts.test.ts on the mainnet fork.


  




