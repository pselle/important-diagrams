import { useQuery } from "@tanstack/react-query";
import nft from "../contracts/nft_enumerable";

const useGetOwner = (tokenId: number) =>
  useQuery({
    queryKey: ["nftOwner", { tokenId }],
    queryFn: async () => {
      const transaction = await nft.owner_of({ token_id: tokenId });
      if (typeof transaction.result === "string") {
        return transaction.result;
      }
      // Otherwise, the token has no owner
      return "Unclaimed";
    },
    enabled: true,
  });

const ArtCard: React.FC<{ tokenId: number }> = ({ tokenId }) => {
  const owner = useGetOwner(tokenId);

  return (
    <>
      <h3>
        art piece #{tokenId}, owned by {owner.data ?? "Loading..."}
      </h3>
    </>
  );
};

export default ArtCard;
