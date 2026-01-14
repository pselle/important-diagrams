import {
  useGetCollectionAddress,
  useGetGalleryAddress,
  useGetOwner,
} from "../hooks/useNftCollection";
import styles from "./styles/ArtCard.module.css";

const ArtCard: React.FC<{ tokenId: number }> = ({ tokenId }) => {
  const { data: galleryAddress } = useGetGalleryAddress();
  console.log("Gallery Address:", galleryAddress);

  const { data: collectionAddress, isLoading: isLoadingAddress } =
    useGetCollectionAddress();
  console.log("Collection Address:", collectionAddress);
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
