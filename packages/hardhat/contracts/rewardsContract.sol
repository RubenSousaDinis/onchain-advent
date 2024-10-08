//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract RewardsContract {
	// State Variables
	address public immutable owner;
	uint256 public totalSponsorships = 0;
	uint256 public maxClaimersPerExercise = 100;
	mapping(address => uint) public sponsorships;
	// Mapping to track rewards by ID
	mapping(uint256 => uint256) public exerciseRewardPool;
	mapping(uint256 => uint256) public exerciseRewardClaimers;
	mapping(uint256 => mapping(address => bool))
		public whitelistedRewardsAddresses;
	mapping(address => mapping(uint256 => uint256)) public claimedRewards;

	// Events: a way to emit log statements from smart contract that can be listened to by external parties
	event Sponsored(address indexed sponsor, uint256 value);

	event RewardSet(uint256 exerciseId, uint256 amount);
	event Whitelisted(uint256 exerciseId, address wallet);
	event RewardClaimed(
		address indexed claimant,
		uint256 exerciseId,
		uint256 amount
	);

	// Events: a way to emit log statements from smart contract that can be listened to by external parties
	event RewardClaimed(address indexed sponsor, uint256 value);

	// Modifier to restrict access to the owner
	modifier onlyOwner() {
		require(msg.sender == owner, "Caller is not the owner");
		_;
	}

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/00_deploy_your_contract.ts
	constructor(address _owner) {
		owner = _owner;
	}

	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function
	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

	/**
	 * Function that allows anyone to sponsor
	 *
	 */
	function sponsor() public payable {
		require(msg.value > 0, "Sponsorship amount must be greater than 0");

		// Update the sponsor's total contributions
		sponsorships[msg.sender] += msg.value;

		// Increment total sponsorship amount
		totalSponsorships += msg.value;

		// Emit Sponsored event
		emit Sponsored(msg.sender, msg.value);
	}

	// Function to set rewards, can only be called by the owner
	function setReward(uint256 exerciseId, uint256 amount) external onlyOwner {
		require(amount > 0, "Reward amount must be greater than 0");

		// Set the reward amount for the specified ID
		exerciseRewardPool[exerciseId] = amount;

		// Emit RewardSet event
		emit RewardSet(exerciseId, amount);
	}

	// Function to set rewards, can only be called by the owner
	function whitelistWallet(
		uint256 exerciseId,
		address wallet
	) external onlyOwner {
		require(
			exerciseRewardClaimers[exerciseId] < maxClaimersPerExercise,
			"Max winners reached"
		);

		// Set the reward amount for the specified ID
		exerciseRewardClaimers[exerciseId] += 1;
		whitelistedRewardsAddresses[exerciseId][wallet] = true;

		// Emit RewardSet event
		emit Whitelisted(exerciseId, wallet);
	}

	// Function for whitelisted wallets to claim rewards
	function claimReward(uint256 exerciseId) external {
		uint256 totalRewardAmount = exerciseRewardPool[exerciseId];
		require(totalRewardAmount > 0, "Reward not set for this ID");
		require(
			whitelistedRewardsAddresses[exerciseId][msg.sender],
			"Not whitelisted"
		);
		require(
			claimedRewards[msg.sender][exerciseId] == 0,
			"Reward already claimed"
		);

		uint256 rewardAmount = totalRewardAmount / maxClaimersPerExercise;

		// Mark reward as claimed
		claimedRewards[msg.sender][exerciseId] = rewardAmount;

		// Transfer the reward to the claimant
		(bool success, ) = payable(msg.sender).call{value: rewardAmount}("");
		require(success, "Reward claim failed");

		// Emit RewardClaimed event
		emit RewardClaimed(msg.sender, exerciseId, rewardAmount);
	}

	// Fallback function to accept plain ETH transfers
	receive() external payable {
		sponsor();
	}
}
