/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3"
import '@primitivefi/hardhat-dodoc';

require('dotenv').config()
const { ALCHEMY_KEY } = process.env;


const CHAIN_IDS = {
  hardhat: 31337, // chain ID for hardhat testing 
};


export default {
  solidity: "0.8.4",
  networks: { 
    mainnet_fork: {
      url: 'http://127.0.0.1:8545',
      chainId: CHAIN_IDS.hardhat,
      forking: {
        // Using Alchemy
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`, // url to RPC node, ${ALCHEMY_KEY} - must be your API key
        // Using Infura
        // url: `https://mainnet.infura.io/v3/${INFURA_KEY}`, // ${INFURA_KEY} - must be your API key
        blockNumber: 12821000, // a specific block number with which you want to work
      },
    },

  }
  

};
