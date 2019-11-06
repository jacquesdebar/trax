// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import * as $ from 'jquery'
import { authEndpoint, clientId, redirectUri, scopes } from './config'
import hash from './hash'
// import Player from "./Player";
import './App.css'
import NewRow from './NewRow'
// import Showcase from "./Showcase";

class App extends Component {
  constructor () {
    super()
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: '' }]
        },
        name: '',
        artists: [{ name: '' }],
        duration_ms: 0
      },
      is_playing: 'Paused',
      progress_ms: 0,
      newReleases: {
        items: [{
          album_type: '',
          artists: [{
            name: '',
            id: '',
            popularity: 0
          }],
          href: '',
          id: '',
          images: [{ url: '' }],
          name: ''
        }],
        offset: 0,
        total: 0
      },
      recents: [{
        track: {
          album: {
            name: '',
            images: [{ url: '' }]
          },
          name: '',
          artists: [{
            name: '',
            id: ''
          }],
          duration_ms: 0,
          explicit: false
        },
        played_at: ''
      }],
      topArtists: {
        items: [{
          name: '',
          popularity: 0,
          genre: ''
        }],
        total: 0,
        limit: 0
      },
      topTracks: {
        items: [{
          name: '',
          album: {
            artists: [{
              name: ''
            }]
          }
        }],
        total: 0,
        limit: 0
      }
    }
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this)
    this.getRecentlyPlayed = this.getRecentlyPlayed.bind(this)
    this.getMostPlayedArtists = this.getMostPlayedArtists.bind(this)
    this.getNewReleases = this.getNewReleases.bind(this)
    this.getMostPlayedTracks = this.getMostPlayedTracks.bind(this)
  }

  componentDidMount () {
    // Set token
    const _token = hash.access_token

    if (_token) {
      // Set token
      this.setState({
        token: _token
      })
      // this.getCurrentlyPlaying(_token);
      this.getRecentlyPlayed(_token)
      this.getMostPlayedArtists(_token)
      this.getNewReleases(_token)
      this.getMostPlayedTracks(_token)
    }
  }

  getCurrentlyPlaying (token) {
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      type: 'GET',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
      },
      success: (data) => {
        // console.log('currentData', data)
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms
        })
      }
    })
  }

  getNewReleases (token) {
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/browse/new-releases?country=US&limit=50',
      type: 'GET',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
      },
      success: (data) => {
        // console.log('newReleases', data)
        this.setState({
          newReleases: data.albums,
        })
      }
    })
  }

/*
        data.albums.array.forEach(album => {
          const albumId =
          this.setState({
            newArtists.albumId.artistName: album.artists[0].name,
            newArtists.albumId.artistId: album.artists[0].id,
            newArtists.albumId.href : album.href,
            newArtists.albumId.type : album.album_type,
            newArtists.albumId.name : album.name,
            newArtists.albumId.imageUrl : album.images[0].url
            }
          })
        });
*/

  getRecentlyPlayed (token) {
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/recently-played',
      type: 'GET',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
      },
      success: (data) => {
        // console.log('recentsData', data)
        this.setState({
          recents: data.items
        })
      }
    })
  }

  getMostPlayedArtists (token) {
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50',
      type: 'GET',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
      },
      success: (data) => {
        // console.log('mostPlayedArtistsData', data)
        this.setState({
          topArtists: data
        })
      }
    })
  }

  getMostPlayedTracks (token) {
    // Make a call using the token
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short`_term&limit=50',
      type: 'GET',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
      },
      success: (data) => {
        // console.log('mostPlayedArtistsData', data)
        this.setState({
          topTracks: data
        })
      }
    })
  }

  /*
  async getArtistPopularity(token, artistId) {
    // Make a call using the token
    console.log($.ajax({
      url: 'https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02',
      type: 'GET',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
      },
      success: (data) => {
        console.log("Name: " + data.name, "Popularity: " + data.popularity)

        return data.popularity
      }
    }))
  }

  console.log(this.state.newArtists)
  console.log('1 song: ', this.state.newReleases.items[0])
  console.log('1 artist: ', this.state.newReleases.items[0].artists[0].id)
  console.log('popularity: ', getArtistPopularity(this.state.token, this.state.newReleases.items[0].artists[0].id))
*/


  render () {

    console.log(this.state.topTracks);

    const sortByPopularity = array => {
      const popArray = array.sort((a, b) => {
        var keyA = a.popularity

        var keyB = b.popularity
        // Compare the 2 dates
        if (keyA < keyB) return 1
        if (keyA > keyB) return -1

        return 0
      })

      return popArray
    }

    const getArtistsPopularity = (token, artistId) => {
      /*
      try {
          const response = await fetch('https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02', {
            headers: {
              Authorization: `Bearer ${token}`
            },
          })
          console.log('Data: ', response.json())
        } catch(e) {
          console.log('Error: ', e)
        }
        */
      // /*
      return fetch('https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          return response.json();
        })
        .then(jsonReponse => {
          return jsonReponse.popularity;
        })
        // */
    }

    const getArtistPopularity = async (token, artistId) => {
      // Make a call using the token
      $.ajax({
        url: 'https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02',
        type: 'GET',
        beforeSend: (xhr) => {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token)
        },
        success: (data) => {
          // console.log("Name: " + data.name, "Popularity: " + data.popularity)

          return data.popularity
        }
      })
    }



    // console.log(this.state.newArtists)
    // console.log('1 song: ', this.state.newReleases.items[0])
    // console.log('1 artist: ', this.state.newReleases.items[0].artists[0].id)
    // console.log('popularity: ', getArtistsPopularity(this.state.token, this.state.newReleases.items[0].artists[0].id))

    const sortByType = array => {
      const r = {
        singles: [],
        albums: [],
        compilations: []
      }
      for (let i = 0; i < array.length; i++) {
        if (array[i].album_type === 'single') {
          r.singles.push(array[i])
        } else if (array[i].album_type === 'album') {
          r.albums.push(array[i])
        } else {
          r.compilations.push(array[i])
        }
      }

      return r
    }

    /*
    const getArtistPopularity = (token, artistId) => {
      // Make a call using the token
      console.log($.ajax({
        url: 'https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02',
        type: 'GET',
        beforeSend: (xhr) => {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token)
        },
        success: (data) => {
          console.log("Name: " + data.name, "Popularity: " + data.popularity)

          return data.popularity
        }
      }))
    }

    console.log(this.state.newArtists)
    console.log('1 song: ', this.state.newReleases.items[0])
    console.log('1 artist: ', this.state.newReleases.items[0].artists[0].id)
    console.log('popularity: ', getArtistPopularity(this.state.token, this.state.newReleases.items[0].artists[0].id))
*/
    let userTopArtists = this.state.topArtists.items
    let userPopularArtists = this.state.topArtists.items
    // let userPopularArtists = sortByPopularity(this.state.topArtists.items)


    return (
      <div className="overall">
        {!this.state.token ? (
          <div className="loggedOut">
            <div style={{ height: '40vh' }}/>
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              '%20'
            )}&response_type=token&show_dialog=true`}
            >
            Login to Spotify
            </a>
          </div>
        ) : (
          <div className="loggedIn">
            <div className="newReleases">
              <h2>New Releases</h2>
              <div className="split">
                <div className="newSingles">
                  <h3>Singles</h3>
                  <div className="newContent">
                    {sortByType(this.state.newReleases.items).singles.map((item) =>
                      <div className="newDrop-block" key={item.id}>
                        <div className="newDrop-img">
                          <img src={item.images[0].url} alt={item.name}/>
                        </div>
                        <div className="newDrop-info">
                          <div className="newDrop-name">{item.name}</div>
                          <div className="newDrop-artist">{item.artists[0].name}</div>
                          <div className="newDrop-type">{item.album_type}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="newAlbums">
                  <h3>Albums / EPs</h3>
                  <div className="newContent">
                    {sortByType(this.state.newReleases.items).albums.map((item) =>
                      <div className="newDrop-block" key={item.id}>
                        <div className="newDrop-img">
                          <img src={item.images[0].url} alt={item.name}/>
                        </div>
                        <div className="newDrop-info">
                          <div className="newDrop-name">{item.name}</div>
                          <div className="newDrop-artist">{item.artists[0].name}</div>
                          <div className="newDrop-type">{item.album_type}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h2 style={{ paddingTop: 50 }}>Collected</h2>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Artist</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Popularity</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.newReleases.items.map((item) =>
                    <NewRow key={item.id} item={item} token={this.state.token}/>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="recents">
              <h2>My recently played</h2>
              {this.state.recents.map((item) => (
                <div className="example" key={`${item.track.name}_${item.track.artists[0].name}_${item.played_at}`}>
                  <div className="recent-img">
                    <img src={item.track.album.images[0].url} alt={item.track.name}/>
                  </div>
                  <div className="recent-under">
                    <div className="recent-name">{item.track.name}</div>
                    <div className="recent-artist">
                      {item.track.artists[0].name}
                    </div>
                    <div className="recent-album">{item.track.album.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="myList">
              <div style={{ width: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                <h2>My most listened:</h2>
                <ol>
                  {userTopArtists.map((item) => (
                    <li key={item.name}>
                      {`${item.name}: ${item.popularity}`}
                    </li>
                  ))}
                </ol>
                <br/>
                <h2>By global popularity:</h2>
                <ol>
                  {userPopularArtists.map(item => (
                    <li key={item.name}>
                      {`${item.name}: ${item.popularity}`}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="myList">
              <div style={{ width: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                <h2>My top tracks:</h2>
                <ol>
                  {this.state.topTracks.items.map((item) => (
                    <li key={item.name}>
                      {`${item.album.artists[0].name} - ${item.name}`}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

      </div>

    )
  }
}

export default App
