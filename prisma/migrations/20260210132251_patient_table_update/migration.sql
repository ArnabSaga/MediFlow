-- CreateIndex
CREATE INDEX "idx_patient_email" ON "patients"("email");

-- CreateIndex
CREATE INDEX "idx_patient_isDeleted" ON "patients"("isDeleted");
