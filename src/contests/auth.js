import { useState, createContext, useEffect } from 'react';
import { auth, db, RecaptchaVerifier } from '../services/firebaseConnections';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail} from 'firebase/auth';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        async function loadUser() {
            const storageUser = localStorage.getItem('@voidpj')
            if (storageUser) {
                setUser(JSON.parse(storageUser))
                
            }
            setLoading(false);
            
        }
        loadUser();
    }, []);

    async function signIn(email, password) {
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);

                let data = {
                    uid: uid,
                    nome: docSnap.data().nome,
                    email: value.user.email,
                    avatarUrl: docSnap.data().avatarUrl
                }
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                navigate("/dashboard");
                toast.success("Seja bem-vindo");
            })
            .catch((error) => {
                console.log(error);
                setLoadingAuth(false);
                toast.error("Tem algo errado aí!")
            })

    }

    async function signUp(email, password, name) {
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                await setDoc(doc(db, "users", uid), {
                    nome: name,
                    avatarUrl: null,
                })
                    .then(() => {

                        let data = {
                            uid: uid,
                            nome: name,
                            email: value.user.email,
                            avatarUrl: null
                        };

                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        navigate("/dashboard");
                        toast.success("Seja bem-vindo");
                    })

            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    toast.error('Este email já está cadastrado!');
                } else {
                    toast.error('Erro ao cadastrar, tente novamente!');
                }
                setLoadingAuth(false);
            });
    }

    async function resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("E-mail de redefinição de senha enviado!");
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                toast.error('Usuário não encontrado!');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('E-mail inválido!');
            } else {
                toast.error('Erro ao enviar e-mail de redefinição, tente novamente!');
            }
            console.error(error);
        }
    }

    function storageUser(data) {
        localStorage.setItem('@voidpj', JSON.stringify(data))
    }

    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@voidpj');
        setUser(null);

    }




    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser,
                resetPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
