import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import {
  Attack,
  DosUnexpectedRevert,
  DosUnexpectedRevertAttack,
  Voting,
} from '../typechain-types';

describe('Dos', async () => {
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let voting: DosUnexpectedRevert;
  let attack: DosUnexpectedRevertAttack;

  beforeEach(async () => {
    [owner, user, user2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory('DosUnexpectedRevert');
    voting = await Voting.deploy();

    const Attack = await ethers.getContractFactory('DosUnexpectedRevertAttack');
    attack = await Attack.deploy(await voting.getAddress());
  });

  it('should let users to vote', async () => {
    await voting.connect(user).vote({ value: ethers.parseEther('1') });

    expect(await voting.balances(user.address)).to.equal(
      ethers.parseEther('1'),
    );
  });

  it('should attack', async () => {
    await voting.connect(user).vote({ value: ethers.parseEther('10') });
    await attack.vote({ value: ethers.parseEther('1') });
    await voting.connect(user2).vote({ value: ethers.parseEther('8') });

    await voting.endVote();
    console.log(await ethers.provider.getBalance(await attack.getAddress()));
    console.log(await ethers.provider.getBalance(user.address));
  });
});
