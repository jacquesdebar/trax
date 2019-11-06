import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import "./Showcase.css";

const Showcase = props => {
  const backgroundStyles = {
    backgroundImage:`url(${
      props.item.track.album.images[0].url
    })`,
  };

  return (
    <div className="recent-block">
      <div className="recent-img">
        <img src={props.item.track.album.images[0].url} alt={props.item.track.name}/>
      </div>
      <div className="recent-under">
        <div className="recent-name">{props.item.track.name}</div>
        <div className="recent-artist">
          {props.item.track.artists[0].name}
        </div>
        <div className="recent-album">{props.item.track.album.name}</div>
      </div>
    </div>
  );
}

export default Showcase;
