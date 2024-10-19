# Cadastro do produtor

Contem os campos

CPF / CNPJ
Nome
Nome da Fazenda
Cidade
Estado
Área total em hectares da fazenda
Área agricultável em hectares
Área de vegetação em hectares
Culturas plantadas (Soja, Milho, Algodão, Café, Cana de Açucar)

# Requisitos de negócio

- [x] O usuário deverá ter a possibilidade de cadastrar, editar, e excluir produtores rurais.
- [x] O sistema deverá validar CPF e CNPJ digitados incorretamente.
- [x] A soma de área agrícultável e vegetação, não deverá ser maior que a área total da fazenda
- [x] Cada produtor pode plantar mais de uma cultura em sua Fazenda.

A plataforma deverá ter um Dashboard que exiba:

- [x] Total de fazendas em quantidade
- [x] Total de fazendas em hectares (área total)
- [x] Gráfico de pizza por estado.
- [x] Gráfico de pizza por cultura.
- [x] Gráfico de pizza por uso de solo (Área agricultável e vegetação)

# Requisitos técnicos

Salvar os dados em um banco de dados Postgres usando o NodeJS como layer de Backend, e entregar os endpoints para cadastrar, editar, e excluir produtores rurais, além do endpoint que retorne os totais para o dashboard.

A criação das estruturas de dados "mockados" faz parte da avaliação.

Desejável:

TypeScript
Conceitos como SOLID, KISS, Clean Code, API Contracts, Tests, Layered Architecture
