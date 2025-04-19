
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { id, isAdopted, adopterName, adopterEmail, adopterContact } = await req.json();
    
    console.log("Update adoption request:", { id, isAdopted, adopterName, adopterEmail, adopterContact });
    
    // Update the animal's adoption status
    const { data, error } = await supabaseClient
      .from('animals')
      .update({ 
        is_adopted: isAdopted,
        adopter_name: adopterName || null,
        adopter_email: adopterEmail || null,
        adopter_contact: adopterContact || null,
        adopted_at: isAdopted ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Return success response with appropriate message based on the action
    let message;
    if (isAdopted && adopterName) {
      message = "Animal marked as adopted";
    } else if (!isAdopted && adopterName) {
      message = "Adoption request submitted and awaiting approval";
    } else {
      message = "Animal marked as not adopted";
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message,
        animal: data?.[0] || null
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error updating adoption status:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
