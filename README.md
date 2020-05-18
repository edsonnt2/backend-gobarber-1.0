## Recuperação de Senha

**RF (Requisito Funcional)**

- O usuário deve poder recuperar sua senha informando o seu email;
- O usuário deve receber um email com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF (Requisito Não Funcional)**

- Utilizar Ethereal ou Mailtrap para testar envios com emails fakes em ambiente de dev;
- Utilizar Amazon SES para envios de emails em ambiente produção;
- O envio de emails deve acontecer em segunda plano (background job)

**RN (Regra de Negócio)**

- O usuário que não existe não pode recuperar uma senha; - ok
- Será enviando junto com o email um token para verificar se o usuário é ele mesmo; - ok
- O link enviado por email para resetar senha, deve expirar em 2h; - ok
- O usuário precisa confirmar a nova senha ao resetar sua senha; - Fazer isso no Middleware de validação
- O token deverá ser excluido após o usuário ter alterado sua senha; - ok

## Atualização do Perfil

**RF**

- O usuário deve poder atualizar seu nome, email e senha;

**RN**

- O usuário não pode alterar seu email para um email já utilizado que não seja o dele mesmo; -> ok
- Para atualizar sua senha, o usuário deve informar a senha antiga; -> ok
- Para atualizar sua senha, o usuário precisa confirmar a nova senha; -> Verificar no middlewera de validação
- Para atualizar deverá ser confirmado a senha antiga com a senha antiga do usuário; -> ok

## Painer do Prestador de Serviço

**RF**

- O prestador deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador do dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

## Agendamento de Serviços

**RF**

- O usuário deve poder listar todos prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente; - ok
- O usuário não pode agendar em um horário já ocupado; - ok
- O usuário não pode agendar em um horário que já passou; - ok
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h); - ok
- O usuário não pode agendar serviços com ele mesmo; - ok
