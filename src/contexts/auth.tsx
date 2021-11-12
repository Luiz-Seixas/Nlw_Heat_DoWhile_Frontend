import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
};

// {} as AuthContextData tipando o contexto
export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
};

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=236fab3aea29576b741f`;

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>("authenticate", {
      code: githubCode,
    });

    const { token, user } = response.data;

    // localStorage.setItem() salva dados no localStorage do navegador, para que esses dados fiquem salvos mesmo que o usuário feche a aplicação e entre de novo, recebe o nome com o qual vai ser salvo e o valor a ser salvo.
    localStorage.setItem("@dowhile:token", token);

    // mandando token para as requisições mesmo que o usuário não atualize a página após fazer login
    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  // deslogando usuário da aplicação removendo os dados dele do userState e do local storage
  function signOut() {
    setUser(null);
    localStorage.removeItem("@dowhile:token");
  }

  useEffect(() => {
    const token = localStorage.getItem("@dowhile:token");

    if (token) {
      // setando o axios para que todas as rotas dessa linha pra baixo vão com o token de autenticação no header por padrão
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>("profile").then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    // pegando url da aplicação
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=");

      // mudando url da aplicação para não mostrar o código do github
      window.history.pushState({}, "", urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    // <AuthContext.Provider> faz com que todos os componentes que estejam dentro dele tenham acesso ao contexto

    // props.children é tudo o que estiver entre o AuthProvider quando for usado

    // value é tudo o que eu quero que passe no contexto, podem ser valores ou funções, só preciso fazer a tipagem certinho
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}
