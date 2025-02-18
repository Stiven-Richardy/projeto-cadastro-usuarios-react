import { useEffect, useState, useRef } from "react";
import "./style.css";
import { Popover } from "@headlessui/react";
import {
  HiMiniXCircle,
  HiMiniPencil,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const inputName = useRef(null);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);

  async function getUsers() {
    const response = await api.get("/usuarios");
    setUsers(response.data);
  }

  async function createUsers() {
    const name = inputName.current?.value.trim();
    const email = inputEmail.current?.value.trim();
    const password = inputPassword.current?.value.trim();

    if (!name || !email || !password) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    if (password.length < 8) {
      alert("A senha deve ter pelo menos 8 caracteres!");
      return;
    }

    await api.post("/usuarios", { name, email, password });
    getUsers();
    inputName.current.value = "";
    inputEmail.current.value = "";
    inputPassword.current.value = "";
  }

  async function updateUsers(id, updateData) {
    await api.put(`/usuarios/${id}`, updateData);
    getUsers();
    setEditingUser(null);
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`);
    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Usuários</h1>
        <input
          name="nome"
          type="text"
          placeholder="Digite seu nome"
          ref={inputName}
        />
        <input
          name="email"
          type="email"
          placeholder="Digite seu email"
          ref={inputEmail}
        />
        <div className="password-visible">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            ref={inputPassword}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {" "}
            {showPassword ? <HiOutlineEye /> : <HiOutlineEyeSlash />}
          </button>
        </div>
        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
          <Popover className="relative">
            <div className="card-buttons">
              <button>
                <HiMiniXCircle onClick={() => deleteUsers(user.id)} />
              </button>
              <Popover.Button>
                <HiMiniPencil onClick={() => setEditingUser(user)} />
              </Popover.Button>

              <Popover.Panel className="popover-panel">
                <h2>Editar Usuário</h2>
                <input
                  type="text"
                  value={editingUser?.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  value={editingUser?.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
                <div className="password-visible">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        password: e.target.value,
                      })
                    }
                    placeholder="Digite a nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {" "}
                    {showPassword ? <HiOutlineEye /> : <HiOutlineEyeSlash />}
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (editingUser.name === "" || editingUser.email === "") {
                      alert("Todos os campos são obrigatórios!");
                    } else if (editingUser.password.length < 8) {
                      alert("A senha deve ter pelo menos 8 caracteres!");
                    } else {
                      updateUsers(editingUser.id, editingUser);
                      location.reload();
                    }
                  }}
                >
                  Salvar
                </button>
                <Popover.Button onClick={() => setEditingUser(null)}>
                  Cancelar
                </Popover.Button>
              </Popover.Panel>
            </div>
          </Popover>
        </div>
      ))}
    </div>
  );
}

export default Home;