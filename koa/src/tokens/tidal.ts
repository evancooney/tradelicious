import axios from 'axios';
import base64 from "base-64"; 

import Router from '@koa/router';
import 'dotenv/config'

const router = new Router();

const clientId = process.env.TIDAL_CLIENT_ID;
const clientSecret = process.env.TIDAL_CLIENT_SECRET;
const authUrl = "https://auth.tidal.com/v1/oauth2/token";

router.use(async (ctx, next) => {
  

  try {
    const credentials = `${clientId}:${clientSecret}`;
    const encodedCreds = base64.encode(credentials);

    const response = await axios.post(authUrl, 
      new URLSearchParams({ grant_type: "client_credentials" }).toString(), 
      {
        headers: {
          Authorization: `Basic ${encodedCreds}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Tidal Auth Token:", response.data);

    ctx.state.token = response.data.access_token;
    await next();
    
    
  } catch (error:any) {
    console.error("Error fetching Tidal token:", error.response ? error.response.data : error.message);
  }
  


});
router.get('/koa/tidal', async (ctx, next) => {

    // const token = await getTidalAuthToken();

    ctx.body = ctx.state.token;
  
  });

export default router;

