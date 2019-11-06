import React, { useEffect, useState } from 'react'

const NewRow = props => {
  const [popularity, setPopularity] = useState(0);

  useEffect(() => {
    fetch(`https://api.spotify.com/v1/artists/${props.item.artists[0].id}`, {
      headers: {
        Authorization: `Bearer ${props.token}`
      }
    })
      .then(response => response.json())
      .then(popularity => setPopularity(popularity.popularity))
  })

  return (
    <tr>
      <td>{props.item.artists[0].name}</td>
      <td>{props.item.name}</td>
      <td>{props.item.album_type}</td>
      <td>{popularity}</td>
    </tr>
  )

}

export default NewRow;