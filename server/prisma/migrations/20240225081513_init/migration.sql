-- CreateTable
CREATE TABLE "LedState" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "LedState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LED" (
    "id" SERIAL NOT NULL,
    "ledStateId" INTEGER NOT NULL,

    CONSTRAINT "LED_pkey" PRIMARY KEY ("id")
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
    "ledStateId" INTEGER NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LedState_state_key" ON "LedState"("state");

-- CreateIndex
CREATE UNIQUE INDEX "LED_ledStateId_key" ON "LED"("ledStateId");

-- CreateIndex
CREATE UNIQUE INDEX "LedConfiguration_gpio_pin_key" ON "LedConfiguration"("gpio_pin");

-- CreateIndex
CREATE UNIQUE INDEX "LedConfiguration_ledId_key" ON "LedConfiguration"("ledId");

-- CreateIndex
CREATE UNIQUE INDEX "Log_ledStateId_key" ON "Log"("ledStateId");

-- AddForeignKey
ALTER TABLE "LED" ADD CONSTRAINT "LED_ledStateId_fkey" FOREIGN KEY ("ledStateId") REFERENCES "LedState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedConfiguration" ADD CONSTRAINT "LedConfiguration_ledId_fkey" FOREIGN KEY ("ledId") REFERENCES "LED"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_ledStateId_fkey" FOREIGN KEY ("ledStateId") REFERENCES "LedState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
