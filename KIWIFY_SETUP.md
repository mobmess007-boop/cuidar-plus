# 🚀 Kiwify Integration - Quick Reference

## 📍 URLs Importantes

**Supabase Project:**
```
https://vfpmznbmpjcxnbmmrpbz.supabase.co
```

**Edge Function URL (após deploy):**
```
https://vfpmznbmpjcxnbmmrpbz.supabase.co/functions/v1/kiwify-webhook
```

---

## ⚡ Passos Rápidos

### 1. Deploy Edge Function
1. Supabase → Edge Functions → Create new function
2. Nome: `kiwify-webhook`
3. Cole o código de `supabase/functions/kiwify-webhook/index.ts`
4. Deploy
5. **Copie a URL**

### 2. Configurar Kiwify
1. Kiwify → Apps → Webhooks → Criar Webhook
2. URL: Cole a URL da Edge Function
3. Evento: ✅ Venda Aprovada
4. Produto: Selecione Cuidar+
5. Salvar

### 3. Testar
1. Crie uma conta no app
2. Verifique se email foi salvo em `profiles`
3. Faça uma venda de teste ou use Postman

---

## 🔍 Verificação Rápida

```sql
-- Ver todos os usuários e status premium
SELECT email, is_premium, full_name 
FROM profiles 
ORDER BY created_at DESC;
```

---

## 📊 Payload de Teste (Postman)

**POST:** `https://vfpmznbmpjcxnbmmrpbz.supabase.co/functions/v1/kiwify-webhook`

**Body (JSON):**
```json
{
  "order_status": "paid",
  "customer": {
    "email": "seu-email-de-teste@email.com"
  }
}
```

---

## ✅ Checklist

- [ ] Edge Function deployada
- [ ] URL copiada e salva
- [ ] Webhook configurado na Kiwify
- [ ] Evento "Venda Aprovada" selecionado
- [ ] Produto vinculado
- [ ] Teste realizado
- [ ] Logs verificados

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Email não salva | Verificar trigger no SQL Editor |
| Webhook não chama | Verificar URL na Kiwify |
| Premium não ativa | Verificar se emails são idênticos |
| Erro 500 | Verificar logs da Edge Function |

---

## 📞 Onde Verificar

- **Logs Edge Function:** Supabase → Edge Functions → kiwify-webhook → Logs
- **Logs Kiwify:** Kiwify → Apps → Webhooks → [seu webhook] → Histórico
- **Dados Usuários:** Supabase → Table Editor → profiles
