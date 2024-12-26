import { Routes, Route } from 'react-router-dom';

import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Recover from '../pages/Recover';

import Private from './private';

function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/recover" element={<Recover />}/>

            <Route path="/dashboard" element={<Private><Dashboard /> </Private>} />

        </Routes>

    )
}

export default RoutesApp;