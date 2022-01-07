import { observer } from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import UserService from "./services/UserService";
import {IUser} from "./models/response/IUser";

const App = () => {

    const [users, setUsers] = useState<IUser[]>([])
    const {store} = useContext(Context)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return <LoginForm />
    }

    async function getUsers() {
        const response = await UserService.fetchUsers()
        setUsers(response.data)
    }

    return (
        <div>
            <h1>{store.isAuth ? `Пользователь авторизован: ${store.user.email}` : 'Авторизуйтесь!'}</h1>
            <h2>{store.user.isActivated ? 'Аккаунт подтвержден' : 'Подтвердите аккаунт по почте'}</h2>
            <button onClick={() => store.logout()}>Выйти</button>
            <button onClick={getUsers}>Получить пользователей</button>
            {users.map(user => <div key={user.email}>{user.email}</div>)}
        </div>
    );
};

export default observer(App);