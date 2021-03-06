//회원정보 수정 눌렀을 때
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Container, Line, ProfileImg } from './MyPageStyle';
import ProfileImage from '../../components/img/profile.png';
import firebase from '../../firebase/firebase';
import { updateUser } from '../../reducer/user';
import useInput from '../../hooks/useInput';

const ChangeUserInfo = ({ history }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput(me.email);
  const [tel, onChangeTel, setTel] = useInput('');
  const [name, onChangeName, setName] = useInput('');
  const [pwd, onChangePwd, setPwd] = useInput('');

  // 로그인한 사용자 전화번호, 이름 데이터 가져오기
  useEffect(() => {
    // 새로고침 되었을때도 값 유지
    firebase.auth().onAuthStateChanged(function () {
      const userId = firebase.auth().currentUser.uid;
      const query = firebase.database().ref(`/users/${userId}`);
      const loadData = async () => {
        try {
          await query.once('value').then(function (snapshot) {
            setTel(snapshot.val().tel);
            setName(snapshot.val().name);
            setPwd(snapshot.val().password);
          });
        } catch (error) {
          console.log(error);
        }
      };
      loadData();
    });
  }, []);

  const { register, watch, errors, handleSubmit } = useForm({
    mode: 'onChange',
  });

  /*  현재 비밀번호 */
  const nowPwd = pwd;
  /* 저장하기 버튼 눌렀을 때 firebase에서 가져오다가 에러나면 알려주는 에러 메세지 */
  const [errorFromSubmit, setErrorFromSubmit] = useState('');

  /* newPassword와 confirmPassword 비교하기 위해 현재 쓴 password */
  const newPassword = useRef();
  newPassword.current = watch('newPassword');

  /* 저장하기 버튼 눌렀을 때 */
  const onSave = async (data) => {
    // firebase에 정보 업데이트하기
    firebase.auth().onAuthStateChanged(function () {
      const userId = firebase.auth().currentUser.uid;

      const updateData = async () => {
        try {
          //Auth 이메일 수정
          const user = firebase.auth().currentUser;
          user
            .updateEmail(`${data.email}`)
            .then(function () {
              //Auth 이메일이 정상적으로 바뀌었다면

              dispatch(updateUser(data.email));

              //데이터베이스에 있는 이메일 수정
              firebase.database().ref(`/users/${userId}`).child('email').set(data.email);
              alert('정보가 수정되었습니다.');
              history.push('/mypage');
            })
            .catch(function (error) {
              //updateEmail 오류났을 때 최근 로그인을 하지 않은 사용자가 수정을 시도하면 에러남.
              alert(error);
            });

          //데이터베이스 정보 수정
          await firebase.database().ref(`/users/${userId}`).child('name').set(data.name);
          await firebase.database().ref(`/users/${userId}`).child('tel').set(data.tel);
          await firebase.database().ref(`/users/${userId}`).child('password').set(data.newPassword);
        } catch (error) {
          setErrorFromSubmit(error);
        }
      };
      updateData();
    });
  };
  return (
    <Container>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <UserInfoContainer onSubmit={handleSubmit(onSave)} id="modify_form">
        <ProfileImg src={ProfileImage} alt="profile" />
        <UserName
          name="name"
          value={name}
          onChange={onChangeName}
          type="text"
          ref={register({
            required: true,
            pattern: /^[가-힣]{2,5}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/,
          })}
        />
        {errors.name && errors.name.type === 'required' && (
          <ErrorMessage1>이름은 반드시 입력해야합니다.</ErrorMessage1>
        )}
        {errors.name && errors.name.type === 'pattern' && (
          <ErrorMessage1>
            한글은 2~6자, 영문은 2~10자 firstname Lastname 형식으로 입력해주세요.
          </ErrorMessage1>
        )}
        <ItemList>
          <Line />
          <InfoItem>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>메일</label>
            <InfoContent
              name="email"
              type="email"
              value={email}
              onChange={onChangeEmail}
              ref={register({
                required: true,
                pattern: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
              })}
            />
          </InfoItem>
          {errors.email && errors.email.type === 'required' && (
            <ErrorMessage>이메일은 반드시 입력해야합니다.</ErrorMessage>
          )}
          {errors.id && errors.id.type === 'pattern' && (
            <ErrorMessage>이메일이 형식에 맞지 않습니다.</ErrorMessage>
          )}
          <Line />
          <InfoItem>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>전화번호</label>
            <InfoContent
              name="tel"
              type="tel"
              value={tel}
              onChange={onChangeTel}
              placeholder="숫자만 입력해주세요."
              ref={register({ required: true, pattern: /(^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/ })}
            />
          </InfoItem>
          {errors.tel && errors.tel.type === 'required' && (
            <ErrorMessage>전화번호는 반드시 입력해야합니다.</ErrorMessage>
          )}
          {errors.tel && errors.tel.type === 'pattern' && (
            <ErrorMessage>전화번호 형식에 맞지 않습니다.</ErrorMessage>
          )}
          <Line />
          <InfoItem>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>현재 비밀번호</label>
            <InfoContent
              name="password"
              type="password"
              value={pwd}
              onChange={onChangePwd}
              ref={register({ required: true, validate: (value) => value === nowPwd })}
            />
          </InfoItem>
          {errors.password && errors.password.type === 'required' && (
            <ErrorMessage>비밀번호는 반드시 입력해야합니다.</ErrorMessage>
          )}
          {errors.password && errors.password.type === 'validate' && (
            <ErrorMessage>현재 비밀번호와 일치하지 않습니다.</ErrorMessage>
          )}
          <Line />
          <InfoItem>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>새 비밀번호</label>
            <InfoContent
              name="newPassword"
              type="password"
              ref={register({
                required: true,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
              })}
            />
          </InfoItem>
          {errors.newPassword && errors.newPassword.type === 'required' && (
            <ErrorMessage>비밀번호는 반드시 입력해야합니다.</ErrorMessage>
          )}
          {errors.newPassword && errors.newPassword.type === 'pattern' && (
            <ErrorMessage>8~20자 영문, 숫자를 사용하세요.</ErrorMessage>
          )}
          <Line />
          <InfoItem>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>새 비밀번호 확인</label>
            <InfoContent
              name="confirmPassword"
              type="password"
              ref={register({
                required: true,
                validate: (value) => value === newPassword.current,
              })}
            />
          </InfoItem>
          {errors.confirmPassword && errors.confirmPassword.type === 'required' && (
            <ErrorMessage>비밀번호 확인은 반드시 입력해야합니다.</ErrorMessage>
          )}
          {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
            <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
          )}
          <Line />
        </ItemList>
      </UserInfoContainer>
      {errorFromSubmit && <ErrorMessage>{errorFromSubmit}</ErrorMessage>}
      <SaveBtn type="submit" value="저장하기" form="modify_form" />
    </Container>
  );
};

const UserInfoContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 480px) {
    width: 100%;
  }
`;
const UserName = styled.input`
  margin-top: 3vh;
  width: 8vw;
  height: 5vh;
  font-weight: bold;
  font-size: 1.35vw;
  :focus {
    outline: none;
  }
  border: none;
  text-align: center;
  @media (max-width: 768px) {
    width: 13vw;
  }
  @media (max-width: 480px) {
    width: 20vw;
    height: 3.3vh;
  }
`;
const ItemList = styled.ul`
  margin: 4.4vh auto 0 auto;
  padding: 0px;
  width: 32vw;
  @media (max-width: 768px) {
    width: 40vw;
  }
  @media (max-width: 480px) {
    width: 100%;
    margin-top: 0vh;
  }
  justify-content: center;
`;
const InfoItem = styled.li`
  margin-top: 2vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Arial;
  font-size: 1.25vw;
  label {
    font-weight: bold;
  }
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: start;
    margin-top: 3vh;
    font-size: 3vw;
  }
`;
const InfoContent = styled.input`
  width: 20vw;
  height: 5vh;
  padding: 0px;
  font-family: Arial;
  font-size: 1.25vw;
  :focus {
    outline: none;
  }
  border: none;
  @media (max-width: 768px) {
    width: 24vw;
  }
  @media (max-width: 480px) {
    width: 100%;
    height: 3.3vh;
    margin-top: 1.5vh;
  }
`;
const ErrorMessage1 = styled.div`
  ::before {
    content: '⚠ ';
  }
  padding: 0;
  color: #ff4444;
  font-family: Arial;
  font-size: 0.8vw;
`;
const ErrorMessage = styled.div`
  ::before {
    content: '⚠ ';
  }
  padding: 0;
  margin-left: 12vw;
  color: #ff4444;
  font-family: Arial;
  font-size: 0.8vw;
  @media (max-width: 768px) {
    margin-left: 16vw;
  }
  @media (max-width: 480px) {
    margin-left: 0vw;
  }
`;

const SaveBtn = styled.input`
  :focus {
    outline: none;
  }
  width: 95px;
  height: 7vh;
  margin-top: 11vh;
  border-radius: 30px;
  border: none;
  background-color: #ea404a;
  font-size: 1.25vw;
  color: white;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 480px) {
    font-size: 4vw;
    margin-top: 8vh;
  }
`;
export default ChangeUserInfo;
