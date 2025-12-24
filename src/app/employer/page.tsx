"use client";

import React from "react";
import Container from "~/_components/global/Container";
import { Text } from "~/_components/global/Text";
import { useTranslation } from "~/hooks/useTranslatoins";

function EmployerPage() {
  const { t } = useTranslation();

  return (
    <Container>
      <Text font={"bold"} size="3xl">
        Employer Page
      </Text>
    </Container>
  );
}

export default EmployerPage;
