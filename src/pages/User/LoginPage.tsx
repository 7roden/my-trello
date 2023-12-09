import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage
: FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isNotValidForm, setIsNotValidForm] = useState(false);

  const clickEntrance = () => {
    const validChars = /^(?![_.])(?!.*[-_.]{2})[a-zA-Z0-9-._]+(?<![-_.])$/;
    const isValidLogin = validChars.test(login);
    const isValidPassword = validChars.test(password);

    if (!isValidLogin || !isValidPassword) setIsNotValidForm(true);

  };

  return (
    <div className="container">
      <div className="FormLogin">
        <h1>Вхід</h1>
        {isNotValidForm && <p className='notValidForm'>Not valid form</p>}
        <form action="">
          <label>
            LoginPage
            : <br />
            <input
              type="text"
              placeholder="LoginPage
              "
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </label>
          <label>
            Password: <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <input type="submit" onClick={clickEntrance} />
        </form>
        <Link to={'/Registration'}>Registration</Link>
      </div>
    </div>
  );
};

export default LoginPage
;
