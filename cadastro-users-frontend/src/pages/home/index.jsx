import { useEffect, useState, useRef } from 'react';
import './style.css';
import { Popover } from '@headlessui/react';
import { HiMiniXCircle, HiMiniPencil } from 'react-icons/hi2';
import api from '../../services/api';

function Home() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const inputName = useRef();
  const inputEmail = useRef();
  const inputAge = useRef();

  async function getUsers() {
    const response = await api.get('/usuarios')
    setUsers(response.data)
  }

  async function createUsers() {
    await api.post('/usuarios', {
      name: inputName.current.value,
      email: inputEmail.current.value,
      age: inputAge.current.value,
    })
    getUsers()
    inputName.current.value = ''
    inputEmail.current.value = ''
    inputAge.current.value = ''
  }

  async function updateUsers(id, updateData) {
      await api.put(`/usuarios/${id}`, updateData)
      getUsers()
      setEditingUser(null)
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)
    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Usuários</h1>
        <input name="nome" type='text' placeholder='Digite seu nome' ref={inputName}/>
        <input name="email" type='email' placeholder='Digite seu email' ref={inputEmail}/>
        <input name="idade" type='number' placeholder='Digite sua idade' ref={inputAge}/>
        <button type="button" onClick={createUsers}>Cadastrar</button>
      </form>
     
      {users.map(user => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Idade: {user.age}</p>
          </div>
          <Popover className='relative'>
            <div className='card-buttons'>
              <button>
                <HiMiniXCircle onClick={() => deleteUsers(user.id)}/>
              </button>
              <Popover.Button>
                <HiMiniPencil onClick={() => setEditingUser(user)}/>
              </Popover.Button>

              <Popover.Panel className="popover-panel">
                <h2>Editar Usuário</h2>
                <input type="text" value={editingUser?.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}/>
                <input type="email" value={editingUser?.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}/>
                <input type="number" value={editingUser?.age} onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}/>
                <Popover.Button onClick={() => updateUsers(editingUser.id, editingUser)}>Salvar</Popover.Button>
                <Popover.Button onClick={() => setEditingUser(null)}>Cancelar</Popover.Button>
              </Popover.Panel>
            </div>
          </Popover>
        </div>
      ))}
    </div>
  )
}

export default Home