# Cuidar+ Saúde Pessoal

Controle pessoal de saúde: Pressão, Medicamentos e Diabetes.

## 🚀 Como Rodar Localmente

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` baseado no `.env.example` e preencha com suas chaves do Supabase.
4. Rode o projeto: `npm run dev`

## 📦 Build para Produção

Para gerar a versão final otimizada:
```bash
npm run build
```

## 🌐 Deploy na Vercel

O projeto está configurado para deploy automático na Vercel.

### Variáveis de Ambiente Necessárias

No painel da Vercel, adicione as seguintes variáveis em **Settings > Environment Variables**:

| Variável | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | Sua URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anon do Supabase |

### Configuração de Roteamento

O roteamento SPA já está configurado via `vercel.json`.
