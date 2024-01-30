import stripe from "stripe"
import CircularJSON from "circular-json"
import open from "open"
const STRIPE_KEY = 'sk_test_51Nv0dVSHUS8UbeVicJZf3XZJf72DL9Fs3HP1rXnQzHtaXxMKXwWfua2zi8LQjmmboeNJc3odYs7cvT9Q5YIChY5I00Pocly1O1'




let priceId;
export const takePrice = async(req,res)=>{
    const Stripe = new stripe(STRIPE_KEY)
    const {price , name} = req.body
    try{
        const newprice = await Stripe.prices.create({
            currency: 'inr',
            unit_amount: price,
            product_data: {
              name: name,
            },
          });
         priceId = newprice.id
         res.status(200).json(CircularJSON.stringify({newprice}))

    }
    catch(error){
        res.status(500).json(CircularJSON.stringify({error : error.message}))
    }
}



let sessionsId;
export const sendSession = async(req,res)=>{
    const Stripe = new stripe(STRIPE_KEY)
    
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
          res.status(200).json(CircularJSON.stringify({session}))
          const paymentUrl = session.url
          const sessionId = session.id
          console.log(paymentUrl , sessionId)
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