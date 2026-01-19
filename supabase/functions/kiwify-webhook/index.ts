import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.0"

serve(async (req) => {
    // 1. Receber dados da Kiwify
    const payload = await req.json()
    console.log("Recebido da Kiwify:", payload)

    // 2. Extrair informações (Status e E-mail)
    const orderStatus = payload.order_status
    const email = payload.customer?.email

    if (!email) {
        return new Response(JSON.stringify({ error: "E-mail não encontrado" }), { status: 400 })
    }

    // 3. Conectar ao Supabase
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 4. Se o pagamento foi aprovado, ativar Premium
    if (orderStatus === 'paid' || orderStatus === 'approved') {
        const { error } = await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('email', email) // Certifique-on de que a tabela profiles tem o campo email ou use o ID se tiver

        if (error) {
            console.error("Erro ao atualizar perfil:", error)
            return new Response(JSON.stringify({ error: error.message }), { status: 500 })
        }

        console.log(`Usuário ${email} agora é PREMIUM!`)
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
})
