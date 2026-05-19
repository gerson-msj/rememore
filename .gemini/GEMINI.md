# Contexto do Projeto: Rememore

## Stack Tecnológica

- **Runtime:** Deno
- **Framework:** Fresh (Preact)
- **Gerenciamento de Estado:** Preact Signals (@preact/signals)
- **CSS Framework:** Bulma
- **Persistência:** Client-side via IndexedDB (IDB)

## Diretrizes de Código

- **Signals over State:** Sempre prefira `@preact/signals` e `useSignal` em vez de `useState`.
- **Performance:** Utilize `useComputed` para qualquer valor derivado de outros signals para evitar re-renderizações desnecessárias.
- **Acesso a Signals:** Lembre-se de utilizar `.value` para leitura/escrita no JSX e `.peek()` dentro de callbacks de eventos quando não
  desejar criar uma assinatura de reatividade.
- **Arquitetura:** Mantenha a lógica de acesso a dados nos arquivos de repositório (ex: `*-idb-repository.ts`) seguindo o padrão já
  estabelecido.

## Padrões de UI (Bulma + Custom)

- **Componentes Fixos:** Utilize a classe `is-fixed-sub` para cabeçalhos internos que devem ficar abaixo do header principal.
- **Notificações:** Utilize o padrão `notification is-dark` para listas e `is-pre-wrap` para exibir textos que contenham quebras de linha
  manuais (como as memórias).
- **Ícones:** Utilize FontAwesome 5 (classes `fas fa-*`).

## Regras de Resposta

- Sempre utilize caminhos absolutos baseados na raiz do projeto (`@/` mapeado para o diretório de origem).
- Ao sugerir novos componentes, verifique se existem refs de posicionamento dinâmico (como `parentHeaderRef`) para manter o alinhamento do
  layout fixo.
- Mantenha o estilo de escrita de código conciso e tipado com TypeScript de forma rigorosa.

## Protocolo de Interação

- **Confirmação de Alterações:** Antes de realizar qualquer modificação em arquivos existentes ou criar novos, descreva brevemente o que
  pretende fazer e liste os arquivos impactados.
- **Aprovação:** Aguarde a confirmação ou ajustes do usuário antes de gerar os blocos de código (`diffs` ou novos arquivos).
- **Perguntas Simples:** Se o usuário fizer uma pergunta teórica ou de dúvida rápida, responda de forma textual e só proponha código se for
  solicitado ou essencial para a explicação.

## Glossário de Negócio

- **Memória:** Registro textual de um evento em uma data específica.
- **Categoria:** Classificação atribuída a uma memória (ex: Viagem, Trabalho, Família).
- **Revisar:** Etapa final antes da persistência definitiva (Guardar).
