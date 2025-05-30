import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Head, UserInfo, Charts, Repos, Footer, Corner, Error, RateLimit } from '../components';
import GhPolyglot from 'gh-polyglot';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme, mixins } from '../style';

const { colors } = theme;

const Button = styled.button`
  color: ${colors.white};
  background-color: ${colors.blue};
  font-size: 1.5em;
  margin: 1em;
  padding: 0.25em 1em;
  border: none;
  border-radius: 6px;
  
`;

const User = props => {
  const username = props.query.id;
  const [userData, setUserData] = useState(null);
  const [langData, setLangData] = useState(null);
  const [repoData, setRepoData] = useState(null);
  const [error, setError] = useState({ active: false, type: 200 });
  const [rateLimit, setRateLimit] = useState(null);
  const router = useRouter();

  const getUserData = () => {
    fetch(`https://api.github.com/users/${username}`)
      .then(response => {
        if (response.status === 404) {
          return setError({ active: true, type: 404 });
        }
        if (response.status === 403) {
          return setError({ active: true, type: 403 });
        }
        return response.json();
      })
      .then(json => setUserData(json))
      .catch(error => {
        setError({ active: true, type: 400 });
        console.error('Error:', error);
      });
  };

  const getLangData = () => {
    const me = new GhPolyglot(`${username}`);
    me.userStats((err, stats) => {
      if (err) {
        console.error('Error:', err);
        setError({ active: true, type: 400 });
      }
      setLangData(stats);
    });
  };

  const getRepoData = () => {
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then(response => {
        if (response.status === 404) {
          return setError({ active: true, type: 404 });
        }
        if (response.status === 403) {
          return setError({ active: true, type: 403 });
        }
        return response.json();
      })
      .then(json => setRepoData(json))
      .catch(error => {
        setError({ active: true, type: 200 });
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    fetch(`https://api.github.com/rate_limit`)
      .then(response => response.json())
      .then(json => {
        setRateLimit(json.resources.core);
        if (json.resources.core.remaining < 1) {
          setError({ active: true, type: 403 });
        }
      });

    getUserData();
    getLangData();
    getRepoData();
    
  }, []);

  return (
    <main>
      {rateLimit && <RateLimit rateLimit={rateLimit} />}

      {error && error.active ? (
        <Error error={error} />
      ) : (
        <>
          <Head title={`${username ? `GitStats | ${username}` : 'GitStats'}`} />

          <Corner />

          {userData && <UserInfo userData={userData} />}

          {langData && repoData && <Charts langData={langData} repoData={repoData} />}

          {repoData && <Repos repoData={repoData} />}

          <Button type="button" onClick={() => router.push('/')}>
            Home ▲
          </Button>

          <Footer />
        </>
      )}
    </main>
  );
};

User.propTypes = {
  query: PropTypes.object,
};

export default User;
