import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import Detail from './Detail';
import BrandMagazine from './BrandMagazine';
import { useScrollTop } from '../../utils/scrollTop';

const Magazine = () => {
  useScrollTop(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Banner>
        <Desc>
          <SubDesc>도블의 기부 관련 소식과 브랜드들을 만나보세요.</SubDesc>
          <Title>Magazine</Title>
          <Title>2020 -NOV</Title>
        </Desc>
      </Banner>
      <Route path="/magazine" exact component={BrandMagazine} />
      <Route path="/magazine/:category" component={Detail} />
    </div>
  );
};

const Banner = styled.div`
  height: 80vh;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-image: url('https://github.com/PURPLECODE-TEAM/dobble_website/blob/master/src/components/img/magazineBanner.png?raw=true');
`;

const Desc = styled.div`
  padding: 0 80px;
  padding-top: 140px;
  @media (max-width: 768px) {
    padding: 0 40px;
    padding-top: 140px;
  }
`;

const SubDesc = styled.div`
  color: rgb(70, 70, 70);
  font-size: 0.8rem;
  font-family: Arial;
`;

const Title = styled.div`
  color: #303030;
  margin-top: 10px;
  font-size: 3.4rem;
  font-family: Stilu;
  font-weight: bold;
`;

export default Magazine;
