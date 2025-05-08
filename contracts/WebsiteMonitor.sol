// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract WebsiteMonitor {
    enum WebsiteStatus { Good, Bad, Unknown }

    struct WebsiteTick {
        address validator;
        uint256 createdAt;
        WebsiteStatus status;
        uint256 latency;
    }

    struct Website {
        string url;
        address owner;
        bool disabled;
        WebsiteTick[] ticks;
    }

    struct Validator {
        string publicKey;
        string location;
        uint256 pendingPayouts;
    }

    mapping(bytes32 => Website) public websites;
    mapping(address => Validator) public validators;
    mapping(address => bytes32[]) public userWebsiteIds;

    event WebsiteCreated(bytes32 indexed websiteId, address indexed owner);
    event WebsiteDeleted(bytes32 indexed websiteId, address indexed owner);
    event TickAdded(bytes32 indexed websiteId, address indexed validator);
    event Payout(address indexed validator, uint256 amount);

    function _generateId(string memory _url, address _user) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_url, _user));
    }

    function createWebsite(string memory _url) external returns (bytes32) {
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

        userWebsiteIds[msg.sender].push(websiteId);
        emit WebsiteCreated(websiteId, msg.sender);
        return websiteId;
    }

    function getWebsite(bytes32 websiteId) external view returns (
        string memory url,
        address owner,
        bool disabled,
        WebsiteTick[] memory ticks
    ) {
        Website storage w = websites[websiteId];
        require(bytes(w.url).length != 0, "Not found");
        return (w.url, w.owner, w.disabled, w.ticks);
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

    function registerValidator(string memory _publicKey, string memory _location) external {
        validators[msg.sender] = Validator({
            publicKey: _publicKey,
            location: _location,
            pendingPayouts: 0
        });
    }

    function addTick(
        bytes32 websiteId,
        WebsiteStatus status,
        uint256 latency
    ) external {
        require(bytes(websites[websiteId].url).length != 0, "Website doesn't exist");
        require(!websites[websiteId].disabled, "Website is disabled");

        websites[websiteId].ticks.push(WebsiteTick({
            validator: msg.sender,
            createdAt: block.timestamp,
            status: status,
            latency: latency
        }));

        validators[msg.sender].pendingPayouts += 100;
        emit TickAdded(websiteId, msg.sender);
    }

    function getAllWebsites() external view returns (Website[] memory) {
        // Returns all active websites (public)
        uint256 totalCount;
        for (uint256 i = 0; i < userWebsiteIds[msg.sender].length; i++) {
            bytes32 id = userWebsiteIds[msg.sender][i];
            if (!websites[id].disabled) {
                totalCount++;
            }
        }

        Website[] memory result = new Website[](totalCount);
        uint256 j = 0;
        for (uint256 i = 0; i < userWebsiteIds[msg.sender].length; i++) {
            bytes32 id = userWebsiteIds[msg.sender][i];
            if (!websites[id].disabled) {
                result[j++] = websites[id];
            }
        }
        return result;
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

    receive() external payable {}
}
