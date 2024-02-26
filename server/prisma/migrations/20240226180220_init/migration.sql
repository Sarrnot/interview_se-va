-- CreateTable
CREATE TABLE "LedState" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "LedState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Led" (
    "id" SERIAL NOT NULL,
    "ledStateId" INTEGER NOT NULL,

    CONSTRAINT "Led_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedConfiguration" (
    "id" SERIAL NOT NULL,
    "blink_rate" DOUBLE PRECISION NOT NULL,
    "gpio_pin" INTEGER NOT NULL,
    "ledId" INTEGER NOT NULL,

    CONSTRAINT "LedConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "ledId" INTEGER NOT NULL,
    "ledStateId" INTEGER NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LedState_state_key" ON "LedState"("state");

-- CreateIndex
CREATE UNIQUE INDEX "LedConfiguration_gpio_pin_key" ON "LedConfiguration"("gpio_pin");

-- CreateIndex
CREATE UNIQUE INDEX "LedConfiguration_ledId_key" ON "LedConfiguration"("ledId");

-- AddForeignKey
ALTER TABLE "Led" ADD CONSTRAINT "Led_ledStateId_fkey" FOREIGN KEY ("ledStateId") REFERENCES "LedState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedConfiguration" ADD CONSTRAINT "LedConfiguration_ledId_fkey" FOREIGN KEY ("ledId") REFERENCES "Led"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_ledId_fkey" FOREIGN KEY ("ledId") REFERENCES "Led"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_ledStateId_fkey" FOREIGN KEY ("ledStateId") REFERENCES "LedState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
