import * as web3 from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import * as borsh from "borsh";
// Manually initialize variables that are automatically defined in Playground
const PROGRAM_ID = new web3.PublicKey("9FbxJhhavQNMSHEkaRy4MGLKRXEkH1ugeVKLkFpzws1f");
const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");
const wallet = { keypair: web3.Keypair.generate() };


const programId = new web3.PublicKey("89GqFBybJgLCgKzHyLFtGGb91ZdRaZCcCwaNPwLaVm5K");

class MessageAccount {
  message: string;

  constructor(fields: { message: string } | undefined = undefined) {
    if (fields) {
      this.message = fields.message;
    }
  }
}

const MessageSchema = new Map([
  [
    MessageAccount,
    {
      kind: "struct",
      fields: [["message", "string"]],
    },
  ],
]);

async function main() {

  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  const payer = web3.Keypair.generate();

  console.log("Wallet:", payer.publicKey.toBase58());

  const airdrop = await connection.requestAirdrop(
    payer.publicKey,
    web3.LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction(airdrop);

  const messageAccount = web3.Keypair.generate();

  const message = "Hola Solana";

  const messageData = Buffer.from(message);

  const transaction = new web3.Transaction().add(
    new web3.TransactionInstruction({
      keys: [
        {
          pubkey: messageAccount.publicKey,
          isSigner: false,
          isWritable: true,
        },
      ],
      programId,
      data: messageData,
    })
  );

  await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log("Mensaje enviado:", message);
}

main();