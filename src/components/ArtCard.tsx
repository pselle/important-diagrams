import { useQuery } from "@tanstack/react-query";
import squaresGallery from "../contracts/squares_gallery";
import { Client } from "nft_sequential_minting_example";
import { rpcUrl, networkPassphrase } from "../contracts/util";
import styles from "./styles/ArtCard.module.css";

// Create a single NFT client instance once we have the collection address, so we don't remake it
let nftClient: Client | null = null;

const getNftClient = (collectionAddress: string): Client => {
  if (!nftClient) {
    nftClient = new Client({
      networkPassphrase,
      contractId: collectionAddress,
      rpcUrl,
      allowHttp: true,
      publicKey: undefined,
    });
  }
  return nftClient;
};

// Cache the collection address permanently (it never changes)
const useGetCollectionAddress = () =>
  useQuery({
    queryKey: ["collectionAddress"],
    queryFn: async () => {
      const transaction = await squaresGallery.collection_address();
      if (typeof transaction.result === "string") {
        return transaction.result;
      }
      throw new Error("Failed to get collection address");
    },
    enabled: true,
  });

const useGetGalleryAddress = () =>
  useQuery({
    queryKey: ["galleryAddress"],
    queryFn: async () => {
      const transaction = await squaresGallery.gallery_address();
      if (typeof transaction.result === "string") {
        return transaction.result;
      }
      throw new Error("Failed to get gallery address");
    },
    staleTime: Infinity, // Never goes stale - collection address is immutable
    gcTime: Infinity, // Keep in memory forever
    enabled: true,
  });

// Cache NFT owners using the shared collection client
const useGetOwner = (
  tokenId: number,
  collectionAddress?: string,
  galleryAddress?: string,
) =>
  useQuery({
    queryKey: ["nftOwner", { tokenId }],
    queryFn: async () => {
      if (!collectionAddress) {
        throw new Error("Collection address not available");
      }

      const client = getNftClient(collectionAddress);
      const transaction = await client.owner_of({ token_id: tokenId });
      if (typeof transaction.result === "string") {
        if (transaction.result === galleryAddress) {
          return "the Gallery Contract";
        }
        return transaction.result;
      }
      return "Token not minted";
    },
    enabled: !!collectionAddress && !!galleryAddress,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in memory for 30 minutes
  });

const ArtCard: React.FC<{ tokenId: number }> = ({ tokenId }) => {
  const { data: galleryAddress } = useGetGalleryAddress();
  const { data: collectionAddress, isLoading: isLoadingAddress } =
    useGetCollectionAddress();
  const { data: owner, isLoading: isLoadingOwner } = useGetOwner(
    tokenId,
    collectionAddress,
    galleryAddress,
  );
  const leftPadTokenId = String(tokenId).padStart(2, "0");

  const isLoading = isLoadingAddress || isLoadingOwner;
  const displayOwner = isLoading ? "Loading..." : owner;

  return (
    <div className={styles.artCard}>
      <h3>
        art piece #{tokenId}, owned by {displayOwner ?? "Loading..."}
      </h3>
      <img
        src={`./art/${leftPadTokenId}-squares.png`}
        alt={`art piece #${tokenId}`}
      />
    </div>
  );
};

export default ArtCard;
