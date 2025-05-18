Claro, Fernando! Aqui está seu conteúdo formatado corretamente em um `README.md` profissional para o GitHub:

---

````markdown
# 📋 Sistema de Cadastro de Usuários

## 📌 Visão Geral

Aplicação desenvolvida em **React** com **Material-UI** para gerenciamento de usuários, utilizando **IndexedDB** (via Dexie.js) para persistência local dos dados.

---

## ✨ Funcionalidades

- ✅ **CRUD Completo** (Create, Read, Update, Delete)
- ✅ **Validação de Formulários**  
  - Nome: mínimo 3, máximo 50 caracteres  
  - E-mail: formato válido
- ✅ **Busca e Ordenação**  
  - Filtro por nome e e-mail  
  - Ordem alfabética A-Z / Z-A
- ✅ **Dark/Light Mode** com persistência
- ✅ **Toasts de Notificação** com feedback visual
- ✅ **Confirmação de Exclusão** com modal de segurança

---

## 🚀 Como Executar

### 🔧 Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 16 ou superior)

### 💻 Instalação

```bash
git clone https://github.com/FerGBD/user-registration
cd user-registration
npm install
npm run dev
````

### 📦 Build para Produção

```bash
npm run build
```

---

## 🛠 Tecnologias Utilizadas

| Tecnologia     | Finalidade                               |
| -------------- | ---------------------------------------- |
| React          | Biblioteca JavaScript para interfaces    |
| Material-UI    | Componentes UI modernos                  |
| Dexie.js       | Wrapper para IndexedDB                   |
| Formik + Yup   | Gerenciamento de formulários e validação |
| React-Toastify | Notificações e alertas                   |

---

## 📸 Telas

| Funcionalidade | Descrição                                    |
| -------------- | -------------------------------------------- |
| Listagem       | Exibe os usuários com ações (editar/remover) |
| Cadastro       | Formulário com validações                    |
| Edição         | Atualização dos dados                        |
| Dark Mode      | Alternância entre temas claro e escuro       |

---

## 📝 Licença

Este projeto está sob a licença **MIT**.
Sinta-se livre para usar, modificar e distribuir.
