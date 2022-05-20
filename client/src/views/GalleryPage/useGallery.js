import { useState, useEffect } from 'react';

export default function useGallery (offset) {
  const [totalSupply] = useState(200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`https://api.opensea.io/api/v1/assets?asset_contract_address=0x55a2525a0f4b0caa2005fb83a3aa3ac95683c661&order_by=pk&order_direction=desc&offset=${offset}`, {
      method: 'GET',
      headers: {Accept: 'application/json', 'X-API-KEY': '560248ea4c5a46ef9f02e7ef321f6ff3'}
    })
      .then(res => res.json())
      .then(resData => {
          setTokens(prevToken => {
            console.log("prev token")
            console.log(prevToken)
            return [...prevToken, ...resData.assets.map(token => {
              return {
                tokenId: token.token_id,
                imageName: token.name,
                image: token.image_url,
                ownerAddress: token.owner.address,
                ownerImage: token.owner.profile_img_url,
                ownerName: (token.owner.user === null) ? token.owner.address : token.owner.user.username
              };
            })]
          });
        setHasMore(offset < totalSupply);
        setLoading(false)
      })
      .catch(err => setError(true));
  }, [offset, totalSupply]);

  return { loading, error, tokens: tokens, hasMore }
};