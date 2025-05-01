import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FAST2SMS_API_KEY = "K7Mnd521gfptAZ9BHDEXcCxURF6VNJkTIh3wGubWq80ayOLvQ4QCjNXIly1mELf74ear6ndDU2FhpcbR";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { animal } = await req.json();

    const messageBody = `${animal.count} ${animal.type}(s) need urgent help at ${animal.address}. 
Condition: ${animal.healthCondition}. 
Contact: ${animal.uploaderName} ${animal.uploaderContact || 'No phone provided'}`;

    const smsPayload = {
      route: "q", // quick transactional route
      message: messageBody,
      language: "english",
      flash: 0,
      numbers: "9150231058" // recipient number (can be dynamic)
    };

    const smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(smsPayload)
    });

    const smsResult = await smsResponse.json();

    if (!smsResponse.ok || smsResult.return !== true) {
      throw new Error(`Fast2SMS error: ${JSON.stringify(smsResult)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "SMS sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error sending SMS:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
