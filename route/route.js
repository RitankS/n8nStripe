import stripe from "stripe"
import CircularJSON from "circular-json"
import open from "open"
const STRIPE_KEY = 'sk_test_51Nv0dVSHUS8UbeVicJZf3XZJf72DL9Fs3HP1rXnQzHtaXxMKXwWfua2zi8LQjmmboeNJc3odYs7cvT9Q5YIChY5I00Pocly1O1'




let priceId;
export const takePrice = async(req,res)=>{
    const Stripe = new stripe(STRIPE_KEY)
    const {price , name} = req.body
    const unit_amount = Math.ceil(parseFloat(price))
    try{
        const newprice = await Stripe.prices.create({
            currency: 'inr',
            unit_amount,
            product_data: {
              name: name
            },
          });
         priceId = newprice.id
         console.log(priceId)
         console.log(unit_amount)
         res.status(200).json(CircularJSON.stringify({newprice}))

    }
    catch(error){
        res.status(500).json(CircularJSON.stringify({error : error.message}))
    }
}



let sessionsId;
export const sendSession = async(req,res)=>{
    const Stripe = new stripe(STRIPE_KEY)
    const {priceId} = req.body
    try{
    
        const session = await Stripe.checkout.sessions.create({
            success_url: 'http://localhost:3110/payments/status',
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            mode: 'payment',
          });
          sessionsId = session.id
          
          const paymentUrl = session.url
          const sessionId = session.id
  
          console.log(paymentUrl , sessionId)
          res.status(200).json(CircularJSON.stringify({session , sessionId}))
    }
    catch(error){
        res.status(500).json(CircularJSON.stringify({error: error.message}))
        console.log(error)
    }
}


//opening the url in another browser
export const openUrl = async (req, res) => {
    try {
      const url = req.body.url; // Access the `url` property within `req.body`
  
      console.log("url is ", url);
  
      await open(url, { app: { name: 'Chrome' } }); // Specify the browser app
  
      console.log(`Opened ${url} in the default browser.`);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(`Error opening ${url}:`, error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  };


  export const status = async(req,res)=>{
    const Stripe = new stripe(STRIPE_KEY)
    try{
        const session = await Stripe.checkout.sessions.retrieve(
            sessionsId
          );
          const payStatus = session.payment_status
          console.log(payStatus)
          
          res.status(200).json(CircularJSON.stringify({session}))
    }
    catch(error){
        res.status(500).json(CircularJSON.stringify({error: error.message}))
    }
  }



export const checkApproveStatus = async (req, res) => {
  try {
      const { id } = req.body; // Assuming the ID is passed in the request body
      
      // Construct the base request URL
      const baseUrl = `https://${process.env.WEBSERVICES_URL}.autotask.net/atservicesrest/v1.0/Quotes/query`;
      
      // Define pagination variables
      let page = 1;
      let allQuotes = [];
      
      // Fetch quotes recursively until all pages are retrieved
      const fetchQuotes = async () => {
          const url = `${baseUrl}?pageSize=100&page=${page}`;
          
          // Construct the request body with the search filter
          const searchFilter = JSON.stringify({
              filter: [{ op: "eq", field: "id", value: id }]
          });

          // Set up the headers
          const headers = {
              'ApiIntegrationCode': "FPN24RSGC2MFCSZ6SX5BAJJKWNG",
              'UserName': "gg3ebdptems75sb@bask.com",
              'Secret': "6y*SZ@8s#1jNYq~7z3G$Xi$50",
              'Content-Type': 'application/json'
          };

          // Make the API call using fetch
          const response = await fetch(url, {
              method: 'POST',
              headers: headers,
              body: searchFilter
          });

          // Check if the request was successful
          if (response.ok) {
              // Parse the JSON response
              const responseData = await response.json();
              const quotes = responseData ? responseData.value : [];

              // Add retrieved quotes to the result array
              allQuotes.push(...quotes);
              
              // If there are more pages, fetch the next page
              if (quotes.length === 100) {
                  page++;
                  await fetchQuotes();
              } else {
                  // All quotes retrieved, send the response
                  res.status(200).json(allQuotes);
              }
          } else {
              throw new Error('Failed to fetch quotes');
          }
      };
      
      // Start fetching quotes
      await fetchQuotes();
  } catch (error) {
      console.error('Error fetching quotes:', error.message);
      res.status(500).json({ error: error.message });
  }
};

export const callStatusChange = async(req,res)=>{
  try{

  }
  catch{
    res.status(500).json(CircularJSON.stringify({error: error.message}))
  }
}