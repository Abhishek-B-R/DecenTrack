// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract WebsiteMonitor {
    enum WebsiteStatus { Good, Bad }

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

    // Generate a unique ID (off-chain you'd hash the URL or use UUID)
    function _generateId(string memory _url, address _user) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_url, _user));
    }

    function createWebsite(string memory _url) external returns (bytes32) {
        bytes32 websiteId = _generateId(_url, msg.sender);
        Website storage w = websites[websiteId];

        require(bytes(w.url).length == 0, "Already exists");

        Website storage newWebsite = websites[websiteId];
        newWebsite.url = _url;
        newWebsite.owner = msg.sender;
        newWebsite.disabled = false;

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
        require(w.owner == msg.sender, "Not authorized");
        return (w.url, w.owner, w.disabled, w.ticks);
    }

    function getMyWebsites() external view returns (bytes32[] memory ids) {
        return userWebsiteIds[msg.sender];
    }

    function deleteWebsite(bytes32 websiteId) external {
        Website storage w = websites[websiteId];
        require(w.owner == msg.sender, "Unauthorized");
        w.disabled = true;
        emit WebsiteDeleted(websiteId, msg.sender);
    }

    function registerValidator(string memory _publicKey, string memory _location) external {
        Validator storage v = validators[msg.sender];
        v.publicKey = _publicKey;
        v.location = _location;
    }

    function addTick(
        bytes32 websiteId,
        WebsiteStatus status,
        uint256 latency
    ) external {
        require(bytes(websites[websiteId].url).length != 0, "Website doesn't exist");

        Website storage w = websites[websiteId];
        WebsiteTick memory tick = WebsiteTick({
            validator: msg.sender,
            createdAt: block.timestamp,
            status: status,
            latency: latency
        });

        w.ticks.push(tick);
        emit TickAdded(websiteId, msg.sender);
    }
}