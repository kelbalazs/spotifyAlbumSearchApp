import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import './App.css';

const CLIENT_ID = 'dc6f448491614f1d8b7f394282d5f7f2';
const CLIENT_SECRET = 'fa7ee1b3f638456a92419dd77698c927';

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  async function search() {
    console.log("Search for " + searchInput);

    if (!searchInput) {
      console.log("Please enter an artist name.");
      return;
    }

    const searchParameters = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    };

    fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParameters)
      .then((response) => response.json())
      .then((data) => {
        const artistID = data.artists.items[0].id; // Get the artist ID
        console.log("Artist Id is " + artistID); // Log the artist ID

        // Fetch albums
        fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, searchParameters)
          .then((albumsResponse) => albumsResponse.json())
          .then((albumsData) => {
            setAlbums(albumsData.items); // Update state with album data
          })
          .catch((error) => {
            console.error("Error fetching artist's albums:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching artist data:", error);
      });
  }

  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search for Artist'
            type='input'
            onKeyPress={event => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 row-cols-4'>
          {albums.map((album) => (
            <Card key={album.id}>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
