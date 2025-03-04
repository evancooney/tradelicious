import { useState, useEffect } from "react";
import { Typography, CircularProgress } from "@mui/material";
import SongCollectionTable from './components/SongCollectionTable';
import { useParams } from 'react-router-dom';
import SearchBox from './components/SearchBox';

interface ResponseData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function Home() {


  const [response, setResponse] = useState<ResponseData | null>(null);

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const { key } = useParams();

  useEffect(() => {
    if (key) {
      const getLink = async () => {
        try {
          console.log('Looking up old redis ID', key);
          const url = import.meta.env.VITE_API_URL + '/collections/' + key;
          console.log('at URL', url);
          setLoading(true);
          const res = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          const data: ResponseData = await res.json();


          setResponse(data);


        } catch (error) {
          console.error("Error sending request:", error);
          setResponse({ error: "Failed to send request" });

        }
        finally {
          setLoading(false)

        }
      }
      getLink();

    }
  }, [key]);



  const handleSubmit = async (text: string) => {


    try {
      setLoading(true);
      const res = await fetch(import.meta.env.VITE_API_URL + '/analyze', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data: ResponseData = await res.json();

      setResponse(data);


    } catch (error) {
      console.error("Error sending request:", error);
      setResponse({ error: "Failed to send request" });

    }
    finally {
      setLoading(false)
    }
  }




  return (


    <div style={{ margin: 'auto', textAlign: 'center', marginTop: '10vh' }}>


      <Typography variant="h1" >
        Tradelicious
      </Typography>
      <Typography variant="h2" gutterBottom>
        Easily share music across platforms
      </Typography >
      <div style={{ marginLeft: 30, marginRight: 30 }}>
        <SearchBox onSearch={handleSubmit} query={query} setQuery={setQuery} />
      </div>






      <div>
        {loading &&

          <CircularProgress size={80} thickness={5} />



        }
        {response && response?.songs?.length > 0 &&
          <div style={{ maxWidth: 1400, margin: 'auto' }}>
            <SongCollectionTable songs={response.songs} shareLink={response.shareLink} />
          </div>
        }
      </div>

    </div>
  );
}