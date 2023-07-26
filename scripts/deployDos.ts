import { ethers } from 'hardhat';

async function main() {
  const Dos = await ethers.getContractFactory('DosUnexpectedRevert');
  const dos = await Dos.deploy();

  const Attack = await ethers.getContractFactory('DosUnexpectedRevertAttack');
  const attack = await Attack.deploy(await dos.getAddress());

  for (let i = 0; i < 10000; i++) {
    await dos.vote({ value: 200 });
  }
  console.log('Added to array');

  await dos.endVote();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
