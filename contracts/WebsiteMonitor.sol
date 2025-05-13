// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract WebsiteMonitor {
    enum WebsiteStatus { Good, Bad, Unknown }

    struct WebsiteTick {
        address validator;
        uint256 createdAt;
        WebsiteStatus status;
        uint256 latency;
        string location;
    }

    struct Website {
        string url;
        address owner;
        bool disabled;
        WebsiteTick[] ticks;
        string contactInfo; // phone/email
        uint256 currentBalance;
    }

    struct Validator {
        string publicKey;
        string location;
        uint256 pendingPayouts;
    }

    struct TickInput {
        bytes32 websiteId;
        WebsiteStatus status;
        uint256 latency;
    }


    mapping(bytes32 => Website) public websites;
    mapping(address => Validator) public validators;
    mapping(address => bytes32[]) public userWebsiteIds;

    event WebsiteCreated(bytes32 indexed websiteId, address indexed owner);
    event WebsiteDeleted(bytes32 indexed websiteId, address indexed owner);
    event TickAdded(bytes32 indexed websiteId, address indexed validator);
    event Payout(address indexed validator, uint256 amount);
    event BalanceAdded(bytes32 indexed websiteId, uint256 amount);

    function _generateId(string memory _url, address _user) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_url, _user));
    }

    function createWebsite(string memory _url, string memory _contactInfo) external returns (bytes32) {
        bytes32 websiteId = _generateId(_url, msg.sender);
        Website storage w = websites[websiteId];

        if (bytes(w.url).length != 0) {
            require(w.disabled == true, "Already exists");
            w.disabled = false;
            w.owner = msg.sender;
            return websiteId;
        }

        w.url = _url;
        w.owner = msg.sender;
        w.disabled = false;
        w.contactInfo = _contactInfo;
        w.currentBalance = 0;

        userWebsiteIds[msg.sender].push(websiteId);
        emit WebsiteCreated(websiteId, msg.sender);
        return websiteId;
    }

    function getWebsite(bytes32 websiteId) external view returns (
        string memory url,
        address owner,
        bool disabled,
        string memory contactInfo,
        uint256 currentBalance
    ) {
        Website storage w = websites[websiteId];
        require(bytes(w.url).length != 0, "Not found");
        return (w.url, w.owner, w.disabled, w.contactInfo, w.currentBalance);
    }

    function getMyWebsites() external view returns (bytes32[] memory) {
        bytes32[] storage allIds = userWebsiteIds[msg.sender];
        uint256 activeCount;
        for (uint256 i = 0; i < allIds.length; i++) {
            if (!websites[allIds[i]].disabled) {
                activeCount++;
            }
        }

        bytes32[] memory result = new bytes32[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allIds.length; i++) {
            if (!websites[allIds[i]].disabled) {
                result[index++] = allIds[i];
            }
        }

        return result;
    }

    function deleteWebsite(bytes32 websiteId) external {
        Website storage w = websites[websiteId];
        require(w.owner == msg.sender, "Unauthorized");
        w.disabled = true;
        emit WebsiteDeleted(websiteId, msg.sender);
    }

    function isValidatorAuthenticated(address validatorAddress) public view returns (bool) {
        return bytes(validators[validatorAddress].publicKey).length != 0;
    }

    function registerValidator(string memory _publicKey, string memory _location) external {
        if (!isValidatorAuthenticated(msg.sender)) {
            validators[msg.sender] = Validator({
                publicKey: _publicKey,
                location: _location,
                pendingPayouts: 0
            });
        }
    }

    function getValidator(address validatorAddress) external view returns (string memory, string memory, uint256) {
        Validator storage v = validators[validatorAddress];
        require(bytes(v.publicKey).length != 0, "Validator not found");
        return (v.publicKey, v.location, v.pendingPayouts);
    }

    function addTick(
        bytes32 websiteId,
        WebsiteStatus status,
        uint256 latency
    ) external {
        Website storage w = websites[websiteId];
        require(bytes(w.url).length != 0, "Website doesn't exist");
        require(!w.disabled, "Website is disabled");
        require(w.currentBalance >= 0.0001 ether, "Insufficient balance");

        w.ticks.push(WebsiteTick({
            validator: msg.sender,
            createdAt: block.timestamp,
            status: status,
            latency: latency,
            location: validators[msg.sender].location
        }));

        validators[msg.sender].pendingPayouts += 0.0001 ether;
        w.currentBalance -= 0.0001 ether;
        emit TickAdded(websiteId, msg.sender);
    }

    function addMultipleTicks(TickInput[] calldata ticks) external {
        for (uint256 i = 0; i < ticks.length; i++) {
            TickInput calldata tick = ticks[i];
            Website storage w = websites[tick.websiteId];
            
            // Skip if website doesn't exist
            if (bytes(w.url).length == 0) {
                continue;
            }
            // Skip if website is disabled
            if (w.disabled) {
                continue;
            }
            // Skip if website has insufficient balance
            if (w.currentBalance < 0.0001 ether) {
                continue;
            }

            w.ticks.push(WebsiteTick({
                validator: msg.sender,
                createdAt: block.timestamp,
                status: tick.status,
                latency: tick.latency,
                location: validators[msg.sender].location
            }));

            validators[msg.sender].pendingPayouts += 0.0001 ether;
            w.currentBalance -= 0.0001 ether;
        }
        emit TickAdded(websiteId, msg.sender);
    }

    function getAllWebsites() external view returns (bytes32[] memory ids, Website[] memory details) {
        uint256 totalCount;
        bytes32[] storage allIds = userWebsiteIds[msg.sender];
        for (uint256 i = 0; i < allIds.length; i++) {
            if (!websites[allIds[i]].disabled) {
                totalCount++;
            }
        }

        Website[] memory result = new Website[](totalCount);
        bytes32[] memory idResult = new bytes32[](totalCount);
        uint256 j = 0;
        for (uint256 i = 0; i < allIds.length; i++) {
            bytes32 id = allIds[i];
            if (!websites[id].disabled) {
                result[j] = websites[id];
                idResult[j] = id;
                j++;
            }
        }

        return (idResult, result);
    }

    function getWebsiteTicks(bytes32 websiteId) external view returns (WebsiteTick[] memory) {
        return websites[websiteId].ticks;
    }

    function getRecentTicks(bytes32 websiteId, uint256 n) external view returns (WebsiteTick[] memory) {
        WebsiteTick[] storage allTicks = websites[websiteId].ticks;
        uint256 total = allTicks.length;
        uint256 count = n > total ? total : n;

        WebsiteTick[] memory recent = new WebsiteTick[](count);
        for (uint256 i = 0; i < count; i++) {
            recent[i] = allTicks[total - count + i];
        }

        return recent;
    }

    function getMyPayouts() external {
        uint256 payout = validators[msg.sender].pendingPayouts;
        require(payout > 0, "No payouts");
        validators[msg.sender].pendingPayouts = 0;
        payable(msg.sender).transfer(payout);
        emit Payout(msg.sender, payout);
    }

    function myPendingPayout() external view returns (uint256) {
        return validators[msg.sender].pendingPayouts;
    }

    function addWebsiteBalance(bytes32 websiteId) external payable {
        require(bytes(websites[websiteId].url).length != 0, "Website doesn't exist");
        websites[websiteId].currentBalance += msg.value;
        emit BalanceAdded(websiteId, msg.value);
    }

    function getWebsiteBalance(bytes32 websiteId) external view returns (uint256) {
        return websites[websiteId].currentBalance;
    }

    receive() external payable {}
}
