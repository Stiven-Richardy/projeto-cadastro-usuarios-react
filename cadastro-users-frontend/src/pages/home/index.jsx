import { useEffect, useState, useRef } from 'react';
import './style.css';
import { HiMiniXCircle } from 'react-icons/hi2';
import api from '../../services/api';

function Home() {
  const [users, setUsers] = useState([])

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
          <button>
            <HiMiniXCircle onClick={() => deleteUsers(user.id)}/>
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home