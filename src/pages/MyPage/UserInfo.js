import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  InfoItem,
  InfoContent,
  Button,
  Img,
  ItemList,
  LogoutBtn,
  MailTitle,
  ModifyBtn,
  Secession,
  TelTitle,
  UserName,
  Line,
} from './MyPageStyle';
import firebase from '../../firebase/firebase';
import { logoutRequest } from '../../reducer/user';
import HeaderLogo from '../../components/img/doble_icon.png';

const UserInfo = ({ history }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const [tel, setTel] = useState('');
  const [name, setName] = useState('');

  const onLogout = useCallback(() => {
    dispatch(logoutRequest());
  }, []);

  // 로그인한 사용자 전화번호, 이름 데이터 가져오기
  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    const query = firebase.database().ref(`/users/${userId}`);
    const loadData = async () => {
      try {
        await query.once('value').then(function (snapshot) {
          setTel(snapshot.val().tel);
          setName(snapshot.val().name);
        });
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, []);

  const onClick = () => {
    history.push('/mypage/changeuserinfo');
  };
  return (
    <Container>
      <Img src={HeaderLogo} style={{ borderRadius: '50%' }} alt="profile" />
      <UserName>{name}</UserName>
      <ItemList>
        <Line />
        <InfoItem>
          <MailTitle>메일</MailTitle>
          <InfoContent>{me.email}</InfoContent>
        </InfoItem>
        <Line />
        <InfoItem>
          <TelTitle>전화번호</TelTitle>
          <InfoContent>{tel}</InfoContent>
        </InfoItem>
        <Line />
      </ItemList>
      <Button>
        <LogoutBtn type="button" value="로그아웃" onClick={onLogout} />
        <ModifyBtn type="button" value="정보수정" onClick={onClick} />
      </Button>
      <Secession>회원탈퇴</Secession>
    </Container>
  );
};

export default UserInfo;
