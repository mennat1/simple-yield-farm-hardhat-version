
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { Contract } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@openzeppelin/test-helpers";

import { solidity }  from "ethereum-waffle";
chai.use(solidity);


describe("Testing Escrow", () => {

    let acc0: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;
    let acc3: SignerWithAddress;

    let escrow: Contract;
    let mockDAI: Contract;
    let fluxToken: Contract;

    const daiAmount: Number = 100;


  
  before(async() => {

    const Escrow = await ethers.getContractFactory("Escrow");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const FluxToken = await ethers.getContractFactory("FluxToken");
   
    [acc0, acc1, acc2, acc3] = await ethers.getSigners();

    mockDAI = await MockERC20.deploy("MockDAI", "mDAI")
    fluxToken =  await FluxToken.deploy()

   


    await Promise.all([
        mockDAI.mint(acc0.address, daiAmount),
        mockDAI.mint(acc1.address, daiAmount),
        mockDAI.mint(acc2.address, daiAmount),
        mockDAI.mint(acc3.address, daiAmount)
      
    ])

    let escrowParams: Array<string | Number> = [
        mockDAI.address,
        fluxToken.address,
    ]

    // Escrow Contract deployment
    escrow = await Escrow.deploy(...escrowParams)
    
  
  });

  it("should deploy contracts", async() => {
    expect(escrow).to.be.ok
    expect(fluxToken).to.be.ok
    expect(mockDAI).to.be.ok
  })

  it("should return name", async() => {
      expect(await mockDAI.name()).to.eq("MockDAI")
      expect(await fluxToken.name()).to.eq("FluxToken")
      expect(await escrow.name()).to.eq("Flux Farm")


  })

  it("should mint mockDAI to acc0.address, acc1.address, acc2.address", async() => {
    console.log("daiAmount = ", Number(daiAmount))
    expect(Number(await mockDAI.balanceOf(acc0.address))).to.eq(Number(ethers.utils.parseEther(String(daiAmount))));

    expect(Number(await mockDAI.balanceOf(acc1.address))).to.eq(Number(ethers.utils.parseEther(String(daiAmount))));

    expect(Number(await mockDAI.balanceOf(acc2.address))).to.eq(Number(ethers.utils.parseEther(String(daiAmount))));
  });

  it("should stake DAI tokens", async() => {
    let stakeAmount = 10
    console.log("stakeAmount = ", (stakeAmount))
    await mockDAI.connect(acc0).approve(escrow.address, ethers.utils.parseEther("10"));

    let daiBalanceBeforeStaking = await mockDAI.balanceOf(acc0.address)
    console.log("daiBalanceBeforeStaking = ", ethers.utils.formatEther(daiBalanceBeforeStaking))
    expect(await escrow.isStaking(acc0.address)).to.eq(false)
    
    expect(await escrow.connect(acc0).stake(ethers.utils.parseEther(String(stakeAmount)))).to.be.ok

    let daiBalanceAfterStaking = await mockDAI.balanceOf(acc0.address)
    console.log("daiBalanceAfterStaking = ", ethers.utils.formatEther(daiBalanceAfterStaking))


    expect(Number(daiBalanceBeforeStaking))
        .to.eq(Number(daiBalanceAfterStaking) + Number(ethers.utils.parseEther(String(stakeAmount))))

    expect(Number(await escrow.stakingBalance(acc0.address))).to.eq(Number(ethers.utils.parseEther(String(stakeAmount))))
    
    expect(await escrow.isStaking(acc0.address)).to.eq(true)
  })

  it("should revert stake of zero value", async() => {
    await expect(escrow.stake(0)).to.be.revertedWith("You cannot stake zero tokens")
  })

  it("should revert stake if there's no enough DAI token balance", async() => {
    let stakeAmount = ethers.utils.parseEther("150")
    await expect(escrow.stake(stakeAmount)).to.be.revertedWith("stake amount exceeds balance")
  })

 
 
  it("should transfer acc0.addressship", async() => {
    let minter = await fluxToken.MINTER_ROLE()
    let defaultAdminRole = await fluxToken.DEFAULT_ADMIN_ROLE()
    console.log("escrow has fluxToken minter role", await fluxToken.hasRole(minter, escrow.address))
    console.log("acc0.address has fluxToken defaultAdminRole role", await fluxToken.hasRole(defaultAdminRole, acc0.address))
    await fluxToken.grantRole(minter, escrow.address)
    expect(await fluxToken.hasRole(minter, escrow.address)).to.eq(true)
    console.log("escrow has fluxToken minter role", await fluxToken.hasRole(minter, escrow.address))
  });

  it("should return correct yield time", async() => {
    await mockDAI.connect(acc1).approve(escrow.address, ethers.utils.parseEther("10"));
    await escrow.connect(acc1).stake(ethers.utils.parseEther("10"))
    // Fast-forward time for 1 day
    await time.increase(86400) // 1 day forward
    expect(Number(await escrow.calculateStakingTimeInSeconds(acc1.address))).to.be.approximately(86400, 1)
  })

  it("should mint correct token amount when staker withdraws yield", async() => { 
    console.log("Fast forward 2 Days")
    await time.increase(86400) // 1 more day forward
    let secondsStaked = Number(await escrow.calculateStakingTimeInSeconds(acc0.address))
    await escrow.withdrawYield()
    let daysStaked = secondsStaked / 86400
    let daysStakedFormatted = secondsStaked * (10**18) / 86400 // Staked for how many days?
    let daiStaked = await escrow.stakingBalance(acc0.address)
    // await escrow.withdrawYield()
    console.log(`secondsStaked= ${secondsStaked}, daysStaked= ${daysStaked}, daiStaked= ${ethers.utils.formatEther(daiStaked)}`)
    let expectedYield:any = (daiStaked * daysStakedFormatted) / (10**18) // in miniDAI
    console.log("expected yield = ", expectedYield)
    
    let fluxTokenTotalSupply = await fluxToken.totalSupply()    
    console.log("fluxTokenTotalSupply = ", BigInt(fluxTokenTotalSupply))
    let fluxTokenBalance = await fluxToken.balanceOf(acc0.address);
    console.log("acc0.address fluxTokenBalance = ", BigInt(fluxTokenBalance));

    fluxTokenTotalSupply = Number.parseFloat((ethers.utils.formatEther(fluxTokenTotalSupply))).toFixed(2).toString()
    expectedYield =  Number.parseFloat((ethers.utils.formatEther(String(expectedYield)))).toFixed(2).toString()
    console.log("formatted fluxTokenTotalSupply = ", fluxTokenTotalSupply)
    console.log("formatted expected yield = ", expectedYield)
    expect(Number(fluxTokenTotalSupply)).to.be.approximately(20, 0.001)
    expect(Number(expectedYield)).to.be.approximately(20, 0.001)
    expect(Number(expectedYield)).to.eq(Number(fluxTokenTotalSupply))

  })

  it("should update yield balance when unstaked", async() => {
    

    await mockDAI.connect(acc2).approve(escrow.address, ethers.utils.parseEther("10"));
    await escrow.connect(acc2).stake(ethers.utils.parseEther("10"))
    // Fast-forward time
    await time.increase(86400) // 1 day forward
    await escrow.connect(acc2).unstake(ethers.utils.parseEther("10"))
    let fluxTokenBalance = await escrow.fluxTokenBalance(acc2.address)
    let daiTokenBalance = await mockDAI.balanceOf(acc2.address)
    let stakingBalance = await escrow.stakingBalance(acc2.address)
    console.log("fluxTokenBalance = ", Number(ethers.utils.formatEther(fluxTokenBalance)))
    console.log("daiTokenBalance = ", Number(ethers.utils.formatEther(daiTokenBalance)))
    console.log("stakingBalance = ", Number(ethers.utils.formatEther(stakingBalance)))
    expect(Number(ethers.utils.formatEther(fluxTokenBalance))).to.be.approximately(10, 0.001)
    expect(Number(ethers.utils.formatEther(daiTokenBalance))).to.eq(100)
    expect(Number(ethers.utils.formatEther(stakingBalance))).to.eq(0)
    expect(await escrow.isStaking(acc2.address)).to.eq(false)

  })

  it("should return correct yield when partially unstake", async() => {
    await mockDAI.connect(acc3).approve(escrow.address, ethers.utils.parseEther("10"));
    console.log("++++++++++++++++ After staking 10 DAI for 1 day")
    await escrow.connect(acc3).stake(ethers.utils.parseEther("10"))
    await time.increase(86400) 
    let fluxTokenBalance = await escrow.fluxTokenBalance(acc3.address)
    let daiTokenBalance = await mockDAI.balanceOf(acc3.address)
    let stakingBalance = await escrow.stakingBalance(acc3.address)
    console.log("escrow.fluxTokenBalance = ", Number(ethers.utils.formatEther(fluxTokenBalance))) // 0
    console.log("fluxToken.balanceOf(acc3.address) = ", Number(ethers.utils.formatEther(await fluxToken.balanceOf(acc3.address)))) // 0

    console.log("daiTokenBalance = ", Number(ethers.utils.formatEther(daiTokenBalance))) // 90
    console.log("stakingBalance = ", Number(ethers.utils.formatEther(stakingBalance))) // 10

    console.log("++++++++++++++++ Right after partially unstaking 5 DAI") // acc3.address gets back 5 DAI, but he needs to withdraw yield to get accrued fluxTokens
    await escrow.connect(acc3).unstake(ethers.utils.parseEther("5"))

    fluxTokenBalance = await escrow.fluxTokenBalance(acc3.address)
    daiTokenBalance = await mockDAI.balanceOf(acc3.address)
    stakingBalance = await escrow.stakingBalance(acc3.address)
    console.log("escrow.fluxTokenBalance = ", Number(ethers.utils.formatEther(fluxTokenBalance))) // 10
    console.log("fluxToken.balanceOf(acc3.address) = ", Number(ethers.utils.formatEther(await fluxToken.balanceOf(acc3.address)))) // 0

    console.log("daiTokenBalance = ", Number(ethers.utils.formatEther(daiTokenBalance))) // 95
    console.log("stakingBalance = ", Number(ethers.utils.formatEther(stakingBalance))) // 5

    expect(Number(ethers.utils.formatEther(fluxTokenBalance))).to.be.approximately(10,0.001)
    expect(Number(ethers.utils.formatEther(await fluxToken.balanceOf(acc3.address)))).to.eq(0)
    expect(Number(ethers.utils.formatEther(daiTokenBalance))).to.eq(95)
    expect(Number(ethers.utils.formatEther(stakingBalance))).to.eq(5)


    await time.increase(86400)
    console.log("++++++++++++++++ After withdrawing yield of staking 5 DAI for 1 day")
    await escrow.connect(acc3).withdrawYield()

    fluxTokenBalance = await escrow.fluxTokenBalance(acc3.address)
    daiTokenBalance = await mockDAI.balanceOf(acc3.address)
    stakingBalance = await escrow.stakingBalance(acc3.address)
    console.log("escrow.fluxTokenBalance = ", Number(ethers.utils.formatEther(fluxTokenBalance))) // 0
    console.log("fluxToken.balanceOf(acc3.address) = ", Number(ethers.utils.formatEther(await fluxToken.balanceOf(acc3.address)))) // 15

    console.log("daiTokenBalance = ", Number(ethers.utils.formatEther(daiTokenBalance))) // 95
    console.log("stakingBalance = ", Number(ethers.utils.formatEther(stakingBalance))) // 5


    expect(Number(ethers.utils.formatEther(fluxTokenBalance))).to.eq(0)
    expect(Number(ethers.utils.formatEther(await fluxToken.balanceOf(acc3.address)))).to.be.approximately(15, 0.001)
    expect(Number(ethers.utils.formatEther(daiTokenBalance))).to.eq(95)
    expect(Number(ethers.utils.formatEther(stakingBalance))).to.eq(5)


  })

  //  Unstake
  it("should unstake balance from user", async() => {
    let stakingBalance = await escrow.stakingBalance(acc0.address)
    console.log("staking balance = ", Number(ethers.utils.formatEther(stakingBalance)))
    expect(Number(stakingBalance)).to.be.greaterThan(0)
    let daiBalanceBeforeUnStaking = await mockDAI.balanceOf(acc0.address)
    console.log("daiBalanceBeforeUnStaking = ", ethers.utils.formatEther(daiBalanceBeforeUnStaking))

    let amountToUnstake = ethers.utils.parseEther("10")
    await escrow.connect(acc0).unstake(amountToUnstake)

    let daiBalanceAfterUnStaking = await mockDAI.balanceOf(acc0.address)
    console.log("daiBalanceAfterUnStaking = ", ethers.utils.formatEther(daiBalanceAfterUnStaking))
    expect(Number(daiBalanceAfterUnStaking))
        .to.eq(Number(daiBalanceBeforeUnStaking) + Number((amountToUnstake)))
    
    stakingBalance = await escrow.stakingBalance(acc0.address)
    expect(Number(stakingBalance)).to.eq(0);

    expect(await escrow.isStaking(acc0.address)).to.eq(false)
  })



});

