-- CreateTable
CREATE TABLE "PushToken" (
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PushToken_token_key" ON "PushToken"("token");
