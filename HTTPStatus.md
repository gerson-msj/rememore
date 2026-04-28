# HTTP Status

Este arquivo lista os principais status HTTP organizados por categoria, com o codigo, a descricao e quando cada um e usado.

## 1xx - Informacionais

| Codigo | Status | Quando e usado |
| --- | --- | --- |
| 100 | Continue | Indica que o cliente pode continuar enviando o corpo da requisicao apos os headers iniciais. |
| 101 | Switching Protocols | Indica que o servidor aceitou trocar de protocolo, como em upgrade para WebSocket. |
| 102 | Processing | Usado para informar que o servidor recebeu a requisicao e ainda esta processando, comum em WebDAV. |
| 103 | Early Hints | Permite enviar hints antecipados, como `Link preload`, antes da resposta final. |

## 2xx - Sucesso

| Codigo | Status | Quando e usado |
| --- | --- | --- |
| 200 | OK | Requisicao concluida com sucesso e a resposta contem o resultado esperado. |
| 201 | Created | Um novo recurso foi criado com sucesso, comum em `POST`. |
| 202 | Accepted | A requisicao foi aceita para processamento, mas ainda nao foi concluida. |
| 203 | Non-Authoritative Information | A resposta foi obtida com sucesso, mas os metadados vieram de uma fonte transformada ou intermediaria. |
| 204 | No Content | A operacao foi bem-sucedida e nao ha corpo de resposta para retornar. |
| 205 | Reset Content | A operacao foi bem-sucedida e o cliente deve resetar a interface ou formulario. |
| 206 | Partial Content | O servidor retornou apenas parte do recurso, normalmente em requisicoes com `Range`. |
| 207 | Multi-Status | Retorna multiplos resultados para recursos diferentes na mesma resposta, comum em WebDAV. |
| 208 | Already Reported | Evita repetir informacoes de membros ja reportados anteriormente em respostas WebDAV. |
| 226 | IM Used | Indica que o servidor aplicou uma manipulacao incremental ao recurso antes de responder. |

## 3xx - Redirecionamento

| Codigo | Status | Quando e usado |
| --- | --- | --- |
| 300 | Multiple Choices | Existem varias representacoes possiveis para o recurso e o cliente deve escolher uma. |
| 301 | Moved Permanently | O recurso foi movido de forma permanente para outra URL. |
| 302 | Found | O recurso esta temporariamente disponivel em outra URL. |
| 303 | See Other | O cliente deve buscar o resultado em outra URL usando `GET`, comum apos `POST`. |
| 304 | Not Modified | O recurso nao mudou desde a ultima requisicao condicional e o cliente pode usar cache. |
| 305 | Use Proxy | Status historico indicando uso de proxy especifico; hoje e obsoleto. |
| 306 | Unused | Codigo reservado e sem uso pratico atual. |
| 307 | Temporary Redirect | Redirecionamento temporario preservando o metodo HTTP original. |
| 308 | Permanent Redirect | Redirecionamento permanente preservando o metodo HTTP original. |

## 4xx - Erro do cliente

| Codigo | Status | Quando e usado |
| --- | --- | --- |
| 400 | Bad Request | A requisicao e invalida, malformada ou contem dados incorretos. |
| 401 | Unauthorized | O recurso exige autenticacao valida. |
| 402 | Payment Required | Reservado originalmente para pagamentos; raro na pratica. |
| 403 | Forbidden | O servidor entendeu a requisicao, mas se recusa a autorizar o acesso. |
| 404 | Not Found | O recurso solicitado nao foi encontrado. |
| 405 | Method Not Allowed | O metodo HTTP usado nao e permitido para o recurso. |
| 406 | Not Acceptable | O servidor nao consegue gerar resposta compativel com os headers `Accept` enviados. |
| 407 | Proxy Authentication Required | O cliente precisa se autenticar perante um proxy antes de continuar. |
| 408 | Request Timeout | O cliente demorou demais para concluir a requisicao. |
| 409 | Conflict | A requisicao entra em conflito com o estado atual do recurso. |
| 410 | Gone | O recurso existia, mas foi removido de forma permanente. |
| 411 | Length Required | O servidor exige o header `Content-Length`. |
| 412 | Precondition Failed | Uma precondicao enviada em headers como `If-Match` ou `If-Unmodified-Since` falhou. |
| 413 | Content Too Large | O corpo da requisicao excede o tamanho aceito pelo servidor. |
| 414 | URI Too Long | A URI enviada pelo cliente e maior do que o servidor aceita. |
| 415 | Unsupported Media Type | O tipo de conteudo enviado nao e suportado pelo servidor. |
| 416 | Range Not Satisfiable | O intervalo solicitado em `Range` nao pode ser atendido. |
| 417 | Expectation Failed | O servidor nao consegue atender a expectativa informada no header `Expect`. |
| 418 | I'm a Teapot | Codigo definido como brincadeira no protocolo HTCPCP; hoje e usado ocasionalmente para respostas simbolicas. |
| 421 | Misdirected Request | A requisicao foi enviada para um servidor que nao consegue produzir resposta para aquele destino. |
| 422 | Unprocessable Content | O servidor entendeu o formato da requisicao, mas nao consegue processar semanticamente os dados. |
| 423 | Locked | O recurso esta bloqueado e nao pode ser modificado, comum em WebDAV. |
| 424 | Failed Dependency | A operacao falhou porque dependia de outra acao que tambem falhou, comum em WebDAV. |
| 425 | Too Early | O servidor nao quer processar a requisicao ainda, para evitar repeticao de uma operacao nao idempotente. |
| 426 | Upgrade Required | O cliente deve mudar para outro protocolo para continuar. |
| 428 | Precondition Required | O servidor exige que a requisicao seja condicional para evitar sobrescritas concorrentes. |
| 429 | Too Many Requests | O cliente excedeu o limite de requisicoes permitido em um intervalo. |
| 431 | Request Header Fields Too Large | Os headers enviados sao grandes demais para serem processados. |
| 451 | Unavailable For Legal Reasons | O recurso nao esta disponivel por motivo legal, regulatorio ou judicial. |

## 5xx - Erro do servidor

| Codigo | Status | Quando e usado |
| --- | --- | --- |
| 500 | Internal Server Error | O servidor encontrou um erro interno generico durante o processamento. |
| 501 | Not Implemented | O servidor nao implementa a funcionalidade necessaria para atender a requisicao. |
| 502 | Bad Gateway | O servidor atuando como gateway ou proxy recebeu resposta invalida do upstream. |
| 503 | Service Unavailable | O servico esta temporariamente indisponivel, por sobrecarga ou manutencao. |
| 504 | Gateway Timeout | O servidor atuando como gateway ou proxy nao recebeu resposta a tempo do upstream. |
| 505 | HTTP Version Not Supported | A versao HTTP usada pelo cliente nao e suportada pelo servidor. |
| 506 | Variant Also Negotiates | O servidor encontrou erro de configuracao na negociacao de conteudo. |
| 507 | Insufficient Storage | O servidor nao conseguiu armazenar o conteudo necessario para concluir a operacao, comum em WebDAV. |
| 508 | Loop Detected | O servidor detectou um loop infinito durante o processamento, comum em WebDAV. |
| 510 | Not Extended | Sao necessarias extensoes adicionais na requisicao para que o servidor a conclua. |
| 511 | Network Authentication Required | O cliente precisa autenticar-se na rede antes de obter acesso, comum em captive portals. |

## Observacoes

| Tema | Descricao |
| --- | --- |
| Mais usados em APIs | `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`, `503`. |
| Redirecionamentos modernos | Prefira `307` e `308` quando for importante preservar o metodo HTTP original. |
| APIs REST | Para validacao semantica, `422` costuma ser mais claro do que `400` quando o JSON esta correto, mas os dados sao invalidos. |
| Cache | `304` e usado junto com validacao de cache, normalmente com `ETag` ou `Last-Modified`. |
