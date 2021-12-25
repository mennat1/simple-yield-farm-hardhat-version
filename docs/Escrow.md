# Escrow

*Menna Abuelnaga*

> A farm that lets user stake ERC20 tokens and accrue interest of ERC20 fluxTokens

You can use this contract for only the most basic simulation



## Methods

### calculateStakingTimeInSeconds

```solidity
function calculateStakingTimeInSeconds(address user) external view returns (uint256)
```

block.timestamp returns seconds passed since unix epoch till current moment

*startTime[user] returns seconds passed since unix epoch till staker started staking*

#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | the staker address

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The staking time in seconds

### calculateTotalYield

```solidity
function calculateTotalYield(address user) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | the staker address

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The total accrued fuxTokens

### daiToken

```solidity
function daiToken() external view returns (contract IERC20)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20 | undefined

### fluxToken

```solidity
function fluxToken() external view returns (contract FluxToken)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract FluxToken | undefined

### fluxTokenBalance

```solidity
function fluxTokenBalance(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### isStaking

```solidity
function isStaking(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined

### name

```solidity
function name() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined

### stake

```solidity
function stake(uint256 amount) external nonpayable
```

staker must beforeby approve stake amount

*Contract tranfers stake amount from staker balance to its balance and updates vars*

#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | Amount of DAI/ERC20 to be staked

### stakingBalance

```solidity
function stakingBalance(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### startTime

```solidity
function startTime(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### unstake

```solidity
function unstake(uint256 amount) external nonpayable
```

Contract transfers back DAI tokens and updates vars

*This func doesn&#39;t send back accrued fluxTokens, staker must call withdrawYield to do that*

#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | Amount of DAI/ERC20 to unstake and receive back

### withdrawYield

```solidity
function withdrawYield() external nonpayable
```

Contract sends the staker the accrued fluxTokens and updates vars






## Events

### Stake

```solidity
event Stake(address indexed from, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| amount  | uint256 | undefined |

### Unstake

```solidity
event Unstake(address indexed from, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| amount  | uint256 | undefined |

### YieldWithdrawn

```solidity
event YieldWithdrawn(address indexed to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |



