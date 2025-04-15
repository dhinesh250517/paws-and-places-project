
// This is a Supabase Edge Function that will handle sending SMS notifications
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { animal } = await req.json();
    
    // For demo purposes, we're logging the notification instead of actually sending it
    // In a production app, you would integrate with Twilio, Vonage, or another SMS service here
    console.log(`EMERGENCY NOTIFICATION SENT to +91 9150231058: 
      ${animal.count} ${animal.type}(s) needs urgent help at ${animal.address}. 
      Condition: ${animal.healthCondition}. 
      Contact: ${animal.uploaderName} ${animal.uploaderContact || 'no phone provided'}`);
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
