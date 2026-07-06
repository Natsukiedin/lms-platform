import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORSプリフライトリクエストの処理
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Service Role Key を使って Supabase クライアントを作成（管理者権限で実行）
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // この関数を呼び出したユーザーの認証情報をチェック
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user: callingUser }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !callingUser) {
      throw new Error('Not authenticated')
    }

    // リクエストボディから新しいユーザーの情報を取得
    const { email, password, name, tenantId, companyName, role } = await req.json()

    let assignedRole = 'USER'
    
    // TENANT_ADMINを作成しようとしている場合、呼び出し元がSUPER_ADMINかチェックする
    if (role === 'TENANT_ADMIN') {
      const { data: adminData } = await supabaseAdmin.from('users').select('role').eq('id', callingUser.id).single()
      if (adminData?.role === 'SUPER_ADMIN') {
        assignedRole = 'TENANT_ADMIN'
      } else {
        throw new Error('Unauthorized to create TENANT_ADMIN')
      }
    }

    // admin APIを使用して、メール確認なしでユーザーを直接作成
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // 確認メールをスキップして即時有効化
      user_metadata: {
        name: name,
        tenant_id: tenantId,
        company_name: companyName,
        role: assignedRole
      }
    })

    if (createError) throw createError

    return new Response(
      JSON.stringify({ user: newUser.user }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    )
  }
})
