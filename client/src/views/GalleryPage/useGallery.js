import React, { useState, useEffect } from 'react';
import useLoading from "../../components/Loading/useLoading";
import { useAuth } from "context/auth";

export default function useGallery (offset) {
  const [totalSupply, setTotalSupply] = useState(130);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [overlay, setOverlay] = useState(true);

  const [progress, showLoading, hideLoading] = useLoading(overlay);

  //const { totalSupply, setTotalSupply } = useAuth();

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`https://api.opensea.io/api/v1/assets?asset_contract_address=0x55a2525a0f4b0caa2005fb83a3aa3ac95683c661&order_by=token_id&order_direction=desc&offset=${offset}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(resData => {
        for (let [key, value] of Object.entries(resData)) {
          setTokens(prevToken => {
            return [...prevToken, ...value.map(token => {
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
        }
        setHasMore(offset < totalSupply);
        setLoading(false)
      })
      .catch(err => setError(true));
  }, [offset]);

  return { loading, error, tokens: tokens, hasMore }
};