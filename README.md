# Estante — site de afiliado Amazon

## Arquivos
- `index.html` — estrutura da página (raramente precisa mexer)
- `style.css` — visual (cores, fontes, layout)
- `script.js` — lógica (monta a estante, filtros e cards)
- `books.json` — **os produtos**. É esse arquivo que você edita no dia a dia.

## Como adicionar um livro novo
Abra `books.json` e copie um bloco, colando antes do `]` final:

```json
{ "title": "Nome do Livro", "author": "Nome do Autor", "category": "Categoria", "blurb": "Frase curta sobre o livro.", "asin": "CODIGODOASIN", "color": "gold" }
```

- `asin`: o código do produto na Amazon. Fica na URL do produto, algo como
  `amazon.com.br/dp/ASIN_AQUI/...`
- `color`: uma destas opções — `gold`, `moss`, `rust`, `wine`, `teal`, `ink2`
- `category`: pode reaproveitar uma categoria existente ou criar uma nova — os filtros são gerados automaticamente

Não precisa editar HTML, CSS ou JS para isso — só o `books.json`.

## Usando a capa real do livro (sem hospedar imagem)
No `books.json`, cada livro tem um campo `"cover"`. Se deixar vazio (`""`),
o card cai no bloco colorido de fallback. Para usar a capa real:

1. Entre na Amazon **logado na sua conta de Associado**
2. Abra a página do produto
3. Uma barra cinza (SiteStripe) aparece no topo com as opções **Texto**,
   **Imagem**, **Texto+Imagem**
4. Clique em **Imagem** — ela gera um link direto pra imagem, hospedada
   no servidor da própria Amazon (algo como `https://m.media-amazon.com/images/I/xxxxx.jpg`)
5. Cole esse link no campo `"cover"` do livro correspondente

Como a imagem continua no servidor da Amazon, você nunca precisa fazer
upload ou hospedar nada — só referenciar o link.

Se algum link de imagem quebrar no futuro, o card volta sozinho pro
bloco colorido (isso é tratado automaticamente pelo `script.js`).

## Configurar sua tag de afiliado
Abra `script.js` e troque no topo:

```js
const AMAZON_TAG = "SEU-TAG-20";       // sua tag de associado
const AMAZON_DOMAIN = "www.amazon.com.br"; // ou .com, .es, etc.
```

## Testar localmente
Como o site carrega `books.json` via `fetch`, abrir o `index.html` direto
com duplo clique (`file://`) **não funciona** — os navegadores bloqueiam
esse tipo de carregamento por segurança. Você precisa de um servidor local:

**Com Python (já vem instalado no Mac/Linux):**
```
cd estante
python3 -m http.server 8000
```
Depois abra `http://localhost:8000` no navegador.

**Com VS Code:** instale a extensão "Live Server" e clique em "Go Live".

## Publicar de graça
Qualquer uma destas opções funciona bem para este site (é só HTML/CSS/JS estático):

1. **Netlify** (mais simples): entre em netlify.com, arraste a pasta `estante`
   inteira para a área de deploy. Pronto, já fica no ar com um link.
2. **GitHub Pages**: crie um repositório, suba os 4 arquivos, ative Pages
   nas configurações do repositório (Settings → Pages → branch main).
3. **Vercel**: importe a pasta do projeto pelo painel da Vercel.

Depois de publicado, para adicionar um livro novo: edite `books.json` e
suba a alteração de novo (no Netlify dá pra arrastar a pasta atualizada;
no GitHub, é só commitar o arquivo alterado).