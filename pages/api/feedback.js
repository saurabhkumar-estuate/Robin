import fetch from "node-fetch";

const zendesk_url = process.env.ZENDESK_URL;

export default async function handler(req, res) {
  try {  

    const ticketId = req.query.ticketid;
    
    const ticketResponse = await fetch(`${zendesk_url}/api/v2/tickets/${ticketId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization
        }
      });

    const ticketData = await ticketResponse.json();


    const phoneNumberField = ticketData.ticket.custom_fields.filter(field => field.id == 11235495170961);

    const ameyoResponse = await fetch('https://setup34.ameyo.net:8443/ameyowebaccess/command?command=uploadContactAndAddCallback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'hash-key': 'byjus-customer-manager',
            'policy-name': 'token-based-authorization-policy',
            'requesting-host': 'byjus-customer-manager',
        },
        body: new URLSearchParams({data: JSON.stringify({"campaignId":374,"customerAndCallbackRecords":[{"customerRecord":{"phone1":phoneNumberField[0].value,"ticket_id":ticketId}}],"leadId":43369,"status":"NOT_TRIED","properties":{"update.customer":true,"migrate.customer":true},"attempts":0})}).toString()
    });

    const response = await ameyoResponse.json();

    res.status(200).json({ response });
  } catch(e) {
    console.log(e)
    res.status(500).json({e})
  }
}