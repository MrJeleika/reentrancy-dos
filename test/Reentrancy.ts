import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Attack, Voting } from '../typechain-types';

describe('Reentrancy', async () => {
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let voting: Voting;
  let attack: Attack;

  beforeEach(async () => {
    [owner, user, user2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory('Voting');
    voting = await Voting.deploy();

    const Attack = await ethers.getContractFactory('Attack');
    attack = await Attack.deploy(await voting.getAddress());
  });

  it('should let users to vote', async () => {
    await voting.connect(user).vote(50, { value: ethers.parseEther('1') });

    expect(await voting.balances(user.address)).to.equal(
      ethers.parseEther('1'),
    );
  });

  it('should attack', async () => {
    await voting.connect(user).vote(50, { value: ethers.parseEther('10') });
    await voting.connect(user2).vote(90, { value: ethers.parseEther('8') });
    await attack.vote(50, { value: ethers.parseEther('1') });

    expect(
      await ethers.provider.getBalance(await voting.getAddress()),
    ).to.equal(ethers.parseEther('19'));

    await attack.getRefund();
    console.log(await ethers.provider.getBalance(await attack.getAddress()));
    console.log(await ethers.provider.getBalance(await voting.getAddress()));
  });
});
