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

## 🔄 Como Atualizar o App

Sempre que você ou eu fizermos uma alteração no código para corrigir algo ou adicionar uma função, basta rodar estes comandos no terminal:

```bash
# 1. Adiciona as mudanças
git add .

# 2. Salva as mudanças com uma descrição
git commit -m "descrição da mudança"

# 3. Envia para o GitHub (A Vercel atualizará o site automaticamente!)
git push
```

A Vercel detecta o novo código no GitHub e faz o deploy da nova versão em instantes.
