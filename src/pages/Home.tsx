import React from "react";
import { Layout, Text } from "@stellar/design-system";
import ArtCard from "../components/ArtCard";

const Home: React.FC = () => (
  <Layout.Content>
    <Layout.Inset>
      <Text as="h1" size="xl">
        Schotter Squares Collection
      </Text>

      {Array.from(Array(10)).map((_, tokenId) => (
        <ArtCard key={`card-${tokenId}`} tokenId={tokenId} />
      ))}
    </Layout.Inset>
  </Layout.Content>
);

export default Home;
