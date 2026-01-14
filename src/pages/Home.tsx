import React from "react";
import { Layout, Text } from "@stellar/design-system";
import ArtCard from "../components/ArtCard";
import {
  useGetCollectionAddress,
  useGetTokenUri,
} from "../hooks/useNftCollection";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const { data: collectionAddress } = useGetCollectionAddress();
  const { data: sampleTokenUri } = useGetTokenUri(0, collectionAddress); // Get URI for first token

  return (
    <Layout.Content>
      <Layout.Inset>
        <div className={styles.collectionLayout}>
          <div className={styles.collectionHeader}>
            <Text as="h1" size="xl">
              Schotter Squares Collection
            </Text>
            <p className={styles.collectionDescription}>
              A generative art collection featuring geometric squares in the
              style of Georg Nees' Schotter. Each piece is a unique NFT
              showcasing the beauty of controlled randomness and minimalist
              design.
              {sampleTokenUri && (
                <span style={{ display: "block", marginTop: "8px" }}>
                  <small>Base URI: {sampleTokenUri}</small>
                </span>
              )}
            </p>
          </div>

          <div className={styles.artCardsGrid}>
            {Array.from(Array(20)).map((_, tokenId) => (
              <ArtCard key={`card-${tokenId}`} tokenId={tokenId} />
            ))}
          </div>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Home;
