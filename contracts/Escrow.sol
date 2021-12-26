// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FluxToken.sol";

/// @title A farm that lets user stake ERC20 tokens and accrue interest of ERC20 fluxTokens
/// @author Menna Abuelnaga
/// @notice You can use this contract for only the most basic simulation
contract Escrow {

    //Variables:
    mapping(address => uint256) public stakingBalance; //daiTokens staked
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public fluxTokenBalance; // accrued fluxTokens

    string public name = "Flux Farm";

    IERC20 public daiToken;
    FluxToken public fluxToken;


    // Events: 
    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdrawn(address indexed to, uint256 amount);

    constructor(
        IERC20 _daiToken,
        FluxToken _fluxToken
        ) {
            daiToken = _daiToken;
            fluxToken = _fluxToken;
        }

  

    /// @notice staker must beforeby approve stake amount
    /// @dev Contract tranfers stake amount from staker balance to its balance and updates vars
    /// @param amount Amount of DAI/ERC20 to be staked
    function stake(uint256 amount) public { 
        require( amount > 0, "You cannot stake zero tokens");
        require(daiToken.balanceOf(msg.sender) >= amount, "stake amount exceeds balance");
            
        if(isStaking[msg.sender] == true){
            // uint256 toTransfer = calculateTotalYield(msg.sender);
            fluxTokenBalance[msg.sender] += calculateTotalYield(msg.sender);
        }

        daiToken.transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        emit Stake(msg.sender, amount);
    }

    /// @notice Contract transfers back DAI tokens and updates vars
    /// @dev This func doesn't send back accrued fluxTokens, staker must call withdrawYield to do that
    /// @param amount Amount of DAI/ERC20 to unstake and receive back
    function unstake(uint256 amount) public { // Give back the sender their DAI tokens, but not their fluxToken yield
        require(
            isStaking[msg.sender] = true &&
            stakingBalance[msg.sender] >= amount, 
            "Nothing to unstake"
        );

        uint256 accruedYield = calculateTotalYield(msg.sender);
        startTime[msg.sender] = block.timestamp; 
        stakingBalance[msg.sender] -= amount;
        fluxTokenBalance[msg.sender] += accruedYield;
        if(stakingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
        daiToken.transfer(msg.sender, amount);
        emit Unstake(msg.sender, amount);
    }

    /// @notice Contract sends the staker the accrued fluxTokens and updates vars
    function withdrawYield() public {
        uint256 accruedYield = calculateTotalYield(msg.sender);
        // uint accruedYield = ((((((block.timestamp - startTime[msg.sender]) *(10**18))/ 86400)) * stakingBalance[msg.sender])/(10**18));
        require(
            accruedYield > 0 ||
            fluxTokenBalance[msg.sender] > 0,
            "Nothing to withdraw"
        );
            
        accruedYield += fluxTokenBalance[msg.sender];
        fluxTokenBalance[msg.sender] = 0;
        startTime[msg.sender] = block.timestamp;
        fluxToken.mint(msg.sender, accruedYield);
        emit YieldWithdrawn(msg.sender, accruedYield);
    }

    /// @notice block.timestamp returns seconds passed since unix epoch till current moment
    /// @dev startTime[user] returns seconds passed since unix epoch till staker started staking
    /// @param user the staker address
    /// @return The staking time in seconds
    function calculateStakingTimeInSeconds(address user) public view returns(uint256){
        return (block.timestamp - startTime[user]);
    }

    /// @notice Staker receives 1 fluxToken for each 1 staked DAI for each Day of Staking
    /// @dev seconds per day = 24 * 60 * 60 = 86400 seconds
    // The (10 ** 18) is to avoid decimal places
    // staking seconds = (block.timestamp - startTime[user])
    // staking days = staking seconds / 86400
    /// @param user the staker address
    /// @return The total accrued fuxTokens
    function calculateTotalYield(address user) public view returns(uint256) { // How many fluxTokens accrued?
    
        return ((((((block.timestamp - startTime[user]) * (10**18)) / 86400)) * stakingBalance[user])/(10**18));

    } 


}