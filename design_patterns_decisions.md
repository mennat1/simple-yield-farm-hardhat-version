# Design patterns used:

1)Inter-Contract Execution:
    Escrow Contract calls FluxToken and MockERC20 functions by importing them (aka dependency injection).


2) Inheritance and Interfaces: 
        FluxToken and MockERC20 contracts are ERC20 tokens, they inherit from @openzeppelin/contracts/token/ERC20/ERC20.sol contract.


