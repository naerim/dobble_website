// react-hook-form을 사용해서 회원가입 페이지를 만들었다.
// 회원가입에 필요한 input들이 메일, 이름, 전화번호는 SignUpLayout 컴포넌트에 있고,
// 비밀번호는 Password, 관심있는 브랜드 체크는 InterestedBrand, 정보동의는 AgreeForJoin 컴포넌트에 나눠져있다.
// FormProvider를 사용해서 각각의 인풋들을 React Hook Form과 연결했다.
import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../../firebase/firebase';
import InputContainer from './InputContainer';
import { signupRequest } from '../../reducer/user';

const SignUp = ({ history }) => {
  const methods = useForm({ mode: 'onChange' });
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const { signUpLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      // 이메일과 비밀번호로 유저 생성
      const createUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      await createUser.user.updateProfile({
        displayName: data.name,
      });

      //Firebase 데이터베이스에 저장해주기
      await firebase.database().ref('users').child(createUser.user.uid).set({
        email: data.email,
        name: createUser.user.displayName,
        password: data.password,
        tel: data.tel,
        //메거진 구독 신청여부
        magazineSubs: data.magazineSubs,
        //광고성 정보 수신 동의여부
        advertising: data.check2,
      });

      dispatch(signupRequest(data));
      history.push('/login');
    } catch (error) {
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit('');
      }, 5000);
    }
  };

  return (
    <div>
      <SignUpDiv>
        <TitleP>회원가입</TitleP>
        <DescP>doble에 가입하고 더 많은 혜택을 이용하세요!</DescP>
      </SignUpDiv>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} id="signupForm">
          <InputContainer />
        </form>
      </FormProvider>

      {errorFromSubmit && <ErrorMessage>{errorFromSubmit}</ErrorMessage>}
      <InputBox>
        <SubmitButton form="signupForm" type="submit" disabled={signUpLoading}>
          가입하기
        </SubmitButton>
      </InputBox>
    </div>
  );
};

const TitleP = styled.p`
  text-align: center;
  font-size: 2.0833vw;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 4vw;
  }
`;
const DescP = styled.p`
  text-align: center;
  font-size: 1.25vw;
  color: #888888;
  @media (max-width: 768px) {
    font-size: 2.5vw;
  }
`;
const SignUpDiv = styled.div`
  margin-top: 14vh;
  margin-bottom: 5.185vh;
`;
const SubmitButton = styled.button`
  cursor: pointer;
  padding: 0px;
  display: block;
  margin: 0 auto;
  :focus {
    outline: none;
  }
  width: 30.625vw;
  height: 7.407vh;
  border-radius: 30px;
  border: none;
  background-color: #efefef;
  color: #303030;
  :hover {
    background-color: #d5d2d2;
  }
  @media (max-width: 768px) {
    height: 5vh;
  }
`;
const ErrorMessage = styled.div`
  text-align: center;
  font-family: 'Arial';
  font-size: 1.04vw;
  color: #ff0000;
  ::before {
    content: '⚠ ';
  }
  margin-bottom: 3vh;
`;
const InputBox = styled.div`
  font-size: 1.14vh;
`;
export default SignUp;
