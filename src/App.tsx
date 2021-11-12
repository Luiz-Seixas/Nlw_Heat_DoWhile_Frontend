import { useContext } from "react";
import { LoginBox } from "./components/LoginBox";
import { MessageList } from "./components/MessageList";
import { SendMessageForm } from "./components/SendMessageForm";
import { AuthContext } from "./contexts/auth";
import styles from "./styles/App.module.scss";
// importando com styles o arquivo css com extenção .module e aplicando esse styles."className" para que as configurações aplicadas nessa classe sejam de escopo fechado apenas para esse componente em que está sendo importado e não afete outras partes da aplicação que dividam desse mesmo nome.

export function App() {
  const { user } = useContext(AuthContext);

  //{!!user} vai retornar true caso o usuário não esteja nulo
  // o ? é um else (caso ele não esteja nulo)
  // : é a reação que ele deve execultar caso esteja nulo mesmo

  return (
    <main
      className={`${styles.contentWrapper} ${
        !!user ? styles.contentSigned : ""
      }`}
    >
      <MessageList />
      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  );
}
