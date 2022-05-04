// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.13.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./HeroToken.sol";

contract Hero is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address contractOwner;

    enum Rarity {
        Common,
        UnCommon,
        Rare,
        Legendary
    }

    struct Hero {
        uint256 level;
        bool isOnSale;
        uint256 exp;
        uint256 id;
        uint256 rarity;
        uint16 strength;
        uint16 luck;
        uint16 defense;
        uint16 health;
        uint256 price;
    }

    struct User {
        address player;
        uint256 energy;
        uint256 limit;
    }

    Hero[] public heroes;
    User[] users;
    HeroToken heroToken;
    mapping(address => uint256[]) heroesByOwner;
    mapping(uint256 => address) public ownerByHero;
    mapping(uint256 => uint256) indexOfHero;

    constructor() ERC721("ScribbleHero", "SBH") {
        heroToken = new HeroToken();
        contractOwner = msg.sender;
        // for (uint256 i = 0; 0 < 5; i++) {
        //     uint256 random = block.timestamp % 4;
        //     uint256 rarity;
        //     if (random == 0) {
        //         rarity = uint256(Rarity.Common);
        //     } else if (random == 1) {
        //         rarity = uint256(Rarity.UnCommon);
        //     } else if (random == 2) {
        //         rarity = uint256(Rarity.Rare);
        //     } else {
        //         rarity = uint256(Rarity.Legendary);
        //     }
        //     // _safeMint(msg.sender, i);
        //     Hero memory newHero = Hero({
        //         level: 1,
        //         exp: 15,
        //         id: i + 1,
        //         rarity: rarity,
        //         strength: uint16(
        //             (uint256(
        //                 keccak256(
        //                     abi.encodePacked(
        //                         block.difficulty,
        //                         block.timestamp,
        //                         uint256(1 + i)
        //                     )
        //                 )
        //             ) % 10) + 1
        //         ),
        //         luck: uint16(
        //             (uint256(
        //                 keccak256(
        //                     abi.encodePacked(
        //                         block.difficulty,
        //                         block.timestamp,
        //                         uint256(2 + i)
        //                     )
        //                 )
        //             ) % 10) + 1
        //         ),
        //         defense: uint16(
        //             (uint256(
        //                 keccak256(
        //                     abi.encodePacked(
        //                         block.difficulty,
        //                         block.timestamp,
        //                         uint256(3 + i)
        //                     )
        //                 )
        //             ) % 10) + 1
        //         ),
        //         health: uint16(
        //             (uint256(
        //                 keccak256(
        //                     abi.encodePacked(
        //                         block.difficulty,
        //                         block.timestamp,
        //                         uint256(4 + i)
        //                     )
        //                 )
        //             ) % 10) + 1
        //         )
        //     });
        mintFromParents();
        // indexOfHero[_tokenIds.current()] = heroes.length - 1;
        mintFromParents();
        // indexOfHero[_tokenIds.current()] = heroes.length - 1;
        // heroes.push(newHero);
        // }
    }

    function getHeroes() public view returns (Hero[] memory) {
        return heroes;
    }

    function random(uint256 index) private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, index)
                )
            );
    }
    
     function buyHero(address from, address to,uint256 tokenId, bytes memory _data) public{
        address owner = ownerOf(tokenId);
        if(owner == contractOwner){
            _approve(to, tokenId);
        }
        _safeTransfer(from, to, tokenId, _data);
        uint256 index = indexOfHero[tokenId];
        heroes[index].isOnSale = false;
    }

    function sellHero(uint256 id) public {
        uint256 index = indexOfHero[id];
        heroes[index].isOnSale = true;
    }

    function getOwnedHeroes() public view returns (Hero[] memory) {
        uint256[] memory indexes = heroesByOwner[msg.sender];
        Hero[] memory ownedHeroes;
        for (uint256 i = 0; i < indexes.length; i++) {
            ownedHeroes[i] = heroes[indexes[i]];
        }
        return ownedHeroes;
    }

    function levelUp(uint256 heroIndex) public {
        Hero memory hero = heroes[heroIndex];
        require(hero.exp >= hero.level * 5);
        hero.exp -= hero.level * 5;
        hero.level += 1;
        heroes[heroIndex] = hero;
    }

    function _recoverEnegry() private {
        for (uint256 i = 0; i < users.length; i++) {
            users[i].energy += 1;
        }
    }

    function battleResult(uint256 ownHero, uint256 enemy) public {
        uint256 myInd = indexOfHero[ownHero];
        uint256 enemyInd = indexOfHero[enemy];
        Hero memory myHero = heroes[myInd];
        Hero memory enemyHero = heroes[enemyInd];
        uint256 myTol = myHero.defense + myHero.strength + myHero.luck;
        uint256 enTol = enemyHero.defense + enemyHero.strength + enemyHero.luck;
        if(myTol > enTol){
            heroToken.sendTokeToWinner(100, msg.sender, true);
        }
    }

    function mintFromParents() public {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        heroes.push(Hero(1, false, 0, newTokenId, 1, 6, 5, 8, 6, 100));
        indexOfHero[heroes.length - 1] = newTokenId;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(
            newTokenId,
            string(
                abi.encodePacked(
                    "https://gateway.pinata.cloud/ipfs/QmTedmUHpkefXEfrsSb8cwtQsMcFbyDPikGF2EBdrNE9S6/scribble-",
                    Strings.toString(newTokenId),
                    ".json"
                )
            )
        );
    }
}
