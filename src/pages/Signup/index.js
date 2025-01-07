import { useState, useContext } from 'react';
import './signup.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contests/auth';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signUp, loadingAuth } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();

        if (name !== '' && email !== '' && password !== '')  {
            if (password !== confirmPassword) {
                alert('As senhas não correspondem!');
                return;
            }
            await signUp(email, password, name);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e); // Passa o evento para handleSubmit
        }
    };

    return (
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Nova conta</h1>
                    <input
                        type="text"
                        placeholder='Seu nome'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="email@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="*************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <input
                        type="password"
                        placeholder="Confirme sua senha"
                        value={confirmPassword} // Vinculado ao estado confirmPassword
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />

                    <button type="submit">
                        {loadingAuth ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </form>

                <Link to="/">Já possui uma conta? Faça login</Link>
            </div>
        </div>
    );
}
