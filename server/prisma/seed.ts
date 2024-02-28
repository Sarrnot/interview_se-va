import { PrismaClient } from "@prisma/client";
import LedState from "../src/constants/LedState";
const prisma = new PrismaClient();

async function main() {
    await prisma.ledState.createMany({
        data: [
            {
                state: LedState.on,
            },
            {
                state: LedState.off,
            },
            {
                state: LedState.blinking,
            },
        ],
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
