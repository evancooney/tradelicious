import { useState,  useEffect } from "react";
import {  Typography,CircularProgress } from "@mui/material";
import SongCollectionTable from './components/SongCollectionTable';
import { useParams } from 'react-router-dom';
import SearchBox from './components/SearchBox';

interface ResponseData {
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
            setLoading(true);  
          const res = await fetch(import.meta.env.VITE_API_URL + '/collections/'
            + key, {
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
  


  const handleSubmit = async (text:string) => {


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
    }}





  return (
    
    
    <div style={{margin: 'auto', textAlign: 'center', marginTop: '10vh'} }>

   
     <Typography variant="h1" >
        Tradelicious
    </Typography>
    <Typography variant="h2" gutterBottom>
     Easily share music across platforms
        </Typography >
           
    <SearchBox onSearch={handleSubmit} query={query} setQuery={setQuery} />

    {/* <Typography style={{color: '#999', padding: 25}}  >
        Don't have a link handy? Paste this into the textbox: <br/>https://music.apple.com/us/album/limp/153019510?i=153019649
    </Typography> */}
    
   
  
      <div>
        { loading &&
              
                <CircularProgress size={80} thickness={5} />
            
            
         
        }
      {response && response?.songs?.length > 0 && 
          <SongCollectionTable songs={response.songs} shareLink={response.shareLink}/>
        }
      </div>
      
      </div>
  );
}