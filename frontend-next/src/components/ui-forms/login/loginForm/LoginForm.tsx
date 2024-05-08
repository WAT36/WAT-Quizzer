import React, { useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { LoginState, MessageState } from '../../../../../interfaces/state';
import { Button } from '@/components/ui-elements/button/Button';
import { signInAPI } from '@/api/login/signInAPI';

interface LoginFormProps {
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
}

// TODO storybookも追加すること
export const LoginForm = ({ setMessage }: LoginFormProps) => {
  const [loginState, setLoginState] = useState<LoginState>({
    username: '',
    password: ''
  });

  return (
    <FormGroup>
      <FormControl>
        <TextField
          label="ログイン名"
          setStater={(value: string) => {
            setLoginState({
              ...loginState,
              username: value
            });
          }}
        />
        <TextField
          label="パスワード"
          type="password"
          setStater={(value: string) => {
            setLoginState({
              ...loginState,
              password: value
            });
          }}
        />
      </FormControl>
      <Button
        label={'submit'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) => signInAPI({ loginState, setLoginState, setMessage })}
      />
    </FormGroup>
  );
};
