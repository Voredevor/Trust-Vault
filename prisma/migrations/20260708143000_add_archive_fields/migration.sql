ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "VirtualAccount" ADD COLUMN "archivedAt" TIMESTAMP(3);

CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

CREATE INDEX "VirtualAccount_archivedAt_idx" ON "VirtualAccount"("archivedAt");
